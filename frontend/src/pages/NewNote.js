import NoteForm from '../components/NoteForm';

function NewNote() {
  return (
    <div className="page-container">
      <NoteForm mode="create" />
    </div>
  );
}

export default NewNote;