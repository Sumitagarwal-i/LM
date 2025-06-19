
interface GuestNote {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string;
}

const GUEST_NOTES_KEY = 'linkmage_guest_notes';

export const guestStorage = {
  getNotes: (): GuestNote[] => {
    try {
      const stored = localStorage.getItem(GUEST_NOTES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading guest notes:', error);
      return [];
    }
  },

  saveNote: (note: Omit<GuestNote, 'id' | 'created_at' | 'updated_at'>): GuestNote => {
    const notes = guestStorage.getNotes();
    const newNote: GuestNote = {
      ...note,
      id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    notes.unshift(newNote);
    localStorage.setItem(GUEST_NOTES_KEY, JSON.stringify(notes));
    return newNote;
  },

  updateNote: (id: string, updates: Partial<Pick<GuestNote, 'title' | 'content'>>): GuestNote | null => {
    const notes = guestStorage.getNotes();
    const noteIndex = notes.findIndex(note => note.id === id);
    
    if (noteIndex === -1) return null;
    
    const updatedNote = {
      ...notes[noteIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    
    notes[noteIndex] = updatedNote;
    localStorage.setItem(GUEST_NOTES_KEY, JSON.stringify(notes));
    return updatedNote;
  },

  deleteNote: (id: string): boolean => {
    const notes = guestStorage.getNotes();
    const filteredNotes = notes.filter(note => note.id !== id);
    
    if (filteredNotes.length === notes.length) return false;
    
    localStorage.setItem(GUEST_NOTES_KEY, JSON.stringify(filteredNotes));
    return true;
  },

  clearAllNotes: (): void => {
    localStorage.removeItem(GUEST_NOTES_KEY);
  }
};
