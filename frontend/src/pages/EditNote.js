import { useParams } from 'react-router-dom';
import NoteForm from '../components/NoteForm';

function EditNote() {
  const { id } = useParams();

  return (
    <div className="page-container">
      <NoteForm mode="edit" noteId={id} />
    </div>
  );
}

export default EditNote;