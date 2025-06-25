import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { LinkAnalyzer } from '@/components/analyzer/LinkAnalyzer';
import { useAuth } from '@/contexts/AuthContext';
import { guestStorage } from '@/utils/guestStorage';
import { useEnhancedToast } from '@/hooks/use-toast';
import { apiCall, ErrorHandler } from '@/lib/errorHandler';

interface LinkHistoryItem {
  id: string;
  link: string;
  title: string | null;
  content_type: string | null;
  summary: string | null;
  analysis_data: any;
  created_at: string;
}

// Only lazy-load components that are default exports and exist
const HistoryScreen = React.lazy(() => import('@/components/history/HistoryScreen'));
const NotesScreen = React.lazy(() => import('@/components/notes/NotesScreen'));
const SettingsPage = React.lazy(() => import('@/components/settings/SettingsPage'));
const ResultPanel = React.lazy(() => import('@/components/ResultPanel'));
const HeroSection = React.lazy(() => import('@/components/layout/HeroSection'));
const FeedbackModal = React.lazy(() => import('@/components/layout/FeedbackModal'));
const Footer = React.lazy(() => import('@/components/layout/Footer'));
const AuthModal = React.lazy(() => import('@/components/auth/AuthModal'));

const Index = () => {
  const [activeTab, setActiveTab] = useState('analyzer');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<LinkHistoryItem | null>(null);
  const { user } = useAuth();
  const { showError, showSuccess, showWarning } = useEnhancedToast();
  // Persisted state for LinkAnalyzer
  const [analyzerUrl, setAnalyzerUrl] = useState('');
  const [analyzerAnalysis, setAnalyzerAnalysis] = useState(null);
  const [analyzerResult, setAnalyzerResult] = useState(null);
  const [analyzerActionSetsShown, setAnalyzerActionSetsShown] = useState(1);
  // Add state for notes, loading, editingNote, showNewNoteForm, searchTerm, selectedNoteId
  const [notes, setNotes] = useState<AiNote[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [editingNote, setEditingNote] = useState<AiNote | null>(null);
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  useEffect(() => {
    loadNotes();
    // eslint-disable-next-line
  }, [user]);

  const isGuest = !user || user.is_anonymous;

  const loadNotes = async () => {
    setLoadingNotes(true);
    try {
      if (isGuest) {
        const guestNotes = guestStorage.getNotes();
        setNotes(guestNotes);
      } else {
        const data = await apiCall<AiNote[]>(`/api/ai_notes?user_id=${user?.id}`, {}, 'loading notes');
        setNotes(data || []);
      }
    } catch (error) {
      showError(error);
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleSaveNote = async (title: string, content: string) => {
    try {
      if (isGuest) {
        const newNote = guestStorage.saveNote({ title, content });
        setNotes(prev => [newNote, ...prev]);
        showSuccess('Note saved locally');
      } else {
        const data = await apiCall<AiNote>(
          `/api/ai_notes?user_id=${user?.id}`,
          {
            method: 'POST',
            body: JSON.stringify({ title, content }),
          },
          'saving note'
        );
        setNotes(prev => [data, ...prev]);
        showSuccess('Note created successfully');
      }
      setShowNewNoteForm(false);
    } catch (error) {
      showError(error, () => handleSaveNote(title, content));
    }
  };

  const handleUpdateNote = async (id: string, title: string, content: string) => {
    try {
      if (isGuest) {
        const updatedNote = guestStorage.updateNote(id, { title, content });
        if (updatedNote) {
          setNotes(prev => prev.map(note => note.id === id ? updatedNote : note));
          showSuccess('Note updated');
        }
      } else {
        const data = await apiCall<AiNote>(
          `/api/ai_notes/${id}?user_id=${user?.id}`,
          {
            method: 'PUT',
            body: JSON.stringify({ title, content }),
          },
          'updating note'
        );
        setNotes(prev => prev.map(note => note.id === id ? data : note));
        showSuccess('Note updated successfully');
      }
      setEditingNote(null);
    } catch (error) {
      showError(error, () => handleUpdateNote(id, title, content));
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      if (isGuest) {
        const success = guestStorage.deleteNote(id);
        if (success) {
          setNotes(prev => prev.filter(note => note.id !== id));
          showSuccess('Note deleted');
        }
      } else {
        await apiCall(
          `/api/ai_notes/${id}?user_id=${user?.id}`,
          { method: 'DELETE' },
          'deleting note'
        );
        setNotes(prev => prev.filter(note => note.id !== id));
        showSuccess('Note deleted successfully');
      }
    } catch (error) {
      showError(error, () => handleDeleteNote(id));
    }
  };

  const handleViewAnalysis = (item: LinkHistoryItem) => {
    setSelectedHistoryItem(item);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'analyzer':
        return (
          <div className="space-y-8">
            <Suspense fallback={<div>Loading...</div>}>
              <HeroSection />
              <LinkAnalyzer
                url={analyzerUrl}
                setUrl={setAnalyzerUrl}
                analysis={analyzerAnalysis}
                setAnalysis={setAnalyzerAnalysis}
                result={analyzerResult}
                setResult={setAnalyzerResult}
                actionSetsShown={analyzerActionSetsShown}
                setActionSetsShown={setAnalyzerActionSetsShown}
              />
            </Suspense>
          </div>
        );
      case 'history':
        return <Suspense fallback={<div>Loading...</div>}><HistoryScreen onViewAnalysis={handleViewAnalysis} /></Suspense>;
      case 'notes':
        return <Suspense fallback={<div>Loading...</div>}><NotesScreen
          notes={notes}
          loading={loadingNotes}
          editingNote={editingNote}
          showNewNoteForm={showNewNoteForm}
          searchTerm={searchTerm}
          user={user}
          setEditingNote={setEditingNote}
          setShowNewNoteForm={setShowNewNoteForm}
          setSearchTerm={setSearchTerm}
          onSaveNote={handleSaveNote}
          onUpdateNote={handleUpdateNote}
          onDeleteNote={handleDeleteNote}
        /></Suspense>;
      case 'settings':
        return <Suspense fallback={<div>Loading...</div>}><SettingsPage /></Suspense>;
      default:
        return null;
    }
  };

  return (
    <div
      className="flex flex-col"
      style={{ height: '100vh', overflowY: 'auto', WebkitOverflowScrolling: 'touch', background: '#000' }}
    >
      <Navigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onAuthModalOpen={() => setAuthModalOpen(true)}
        onFeedbackModalOpen={() => setFeedbackModalOpen(true)}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col">
        <div className="max-w-6xl mx-auto w-full">
          {renderActiveScreen()}
        </div>
      </main>

      <Footer onFeedbackModalOpen={() => setFeedbackModalOpen(true)} />

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <FeedbackModal
        open={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
      />

      {selectedHistoryItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="result-box max-w-4xl w-full max-h-[90vh] overflow-auto">
            <ResultPanel
              result={{
                content: selectedHistoryItem.summary || 'No summary available',
                actionTitle: selectedHistoryItem.title || 'Analyzed Link'
              }}
              onClose={() => setSelectedHistoryItem(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
