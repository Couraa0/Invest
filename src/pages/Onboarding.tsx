import { useNavigate } from 'react-router-dom';
import QuestionnaireModal from '../components/QuestionnaireModal';

export default function Onboarding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <QuestionnaireModal
        isOpen={true}
        isDismissable={false}
        onComplete={() => {
          navigate('/dashboard');
        }}
      />
    </div>
  );
}
