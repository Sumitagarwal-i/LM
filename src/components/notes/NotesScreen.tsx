import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, User } from 'lucide-react';
import { RichNoteEditor } from './RichNoteEditor';
import { NoteCard } from './NoteCard';

export interface AiNote {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string;
}

interface NotesScreenProps {
  notes: AiNote[];
  loading: boolean;
  editingNote: AiNote | null;
  showNewNoteForm: boolean;
  searchTerm: string;
  user: any;
  setEditingNote: React.Dispatch<React.SetStateAction<AiNote | null>>;
  setShowNewNoteForm: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  onSaveNote: (title: string, content: string) => void;
  onUpdateNote: (id: string, title: string, content: string) => void;
  onDeleteNote: (id: string) => void;
}

export const NotesScreen: React.FC<NotesScreenProps> = ({
  notes, loading, editingNote, showNewNoteForm, searchTerm, user,
  setEditingNote, setShowNewNoteForm, setSearchTerm,
  onSaveNote, onUpdateNote, onDeleteNote
}) => {
  const isGuest = !user || user.is_anonymous;

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (showNewNoteForm) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">AI Notes</h2>
          {isGuest && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              Guest Mode - Notes saved locally
            </div>
          )}
        </div>
        <RichNoteEditor
          onSave={onSaveNote}
          onCancel={() => setShowNewNoteForm(false)}
        />
      </div>
    );
  }

  if (editingNote) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">AI Notes</h2>
          {isGuest && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              Guest Mode - Notes saved locally
            </div>
          )}
        </div>
        <RichNoteEditor
          initialTitle={editingNote.title}
          initialContent={editingNote.content || ''}
          onSave={(title, content) => onUpdateNote(editingNote.id, title, content)}
          onCancel={() => setEditingNote(null)}
          isEditing={true}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">AI Notes</h2>
        <div className="flex items-center gap-4">
          {isGuest && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              Guest Mode
            </div>
          )}
          <Button
            onClick={() => setShowNewNoteForm(true)}
            className="gap-2 hover-scale"
          >
            <Plus className="h-4 w-4" />
            New Note
          </Button>
        </div>
      </div>

      {notes.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {filteredNotes.length === 0 && notes.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">No notes yet</h3>
            <p className="text-muted-foreground mb-4">
              {isGuest 
                ? "Create your first AI note. It will be saved locally on this device."
                : "Create your first AI note to get started."
              }
            </p>
            <Button onClick={() => setShowNewNoteForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Your First Note
            </Button>
          </div>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">No matching notes</h3>
            <p className="text-muted-foreground">Try adjusting your search term.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={() => setEditingNote(note)}
              onDelete={() => onDeleteNote(note.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
