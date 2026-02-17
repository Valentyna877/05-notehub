import css from "./NoteList.module.css";
import type { Note } from "../../types/note";
import { deleteNote } from "../../services/noteService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Modal from "../Modal/Modal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

export interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate } = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setNoteToDelete(null);
      setErrorMessage(null);
    },
    onError: () => {
      setErrorMessage("Failed to delete note. Please try again.");
},
  });

  return (
    <>
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <small className={css.date}>
              Created: {new Date(note.createdAt).toLocaleDateString()}
            </small>
            <button
              className={css.button}
              onClick={() => setNoteToDelete(note)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
      </ul>

      {errorMessage && <ErrorMessage message={errorMessage} />}
      
      {noteToDelete && (
        <Modal onClose={() => setNoteToDelete(null)}>
          <div className={css.confirmDialog}>
            <p>Are you sure you want to delete "{noteToDelete.title}"?</p>
            <div className={css.actions}>
              <button
                className={css.confirm}
                onClick={() => mutate(noteToDelete.id)}
              >
                Yes
              </button>
              <button
                className={css.cancel}
                onClick={() => setNoteToDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}