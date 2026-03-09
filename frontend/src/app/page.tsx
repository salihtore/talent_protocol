import TaskBoard from '@/components/TaskBoard';
import CreateTaskForm from '@/components/CreateTaskForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <CreateTaskForm />
        <TaskBoard />

      </div>
    </main>
  );
}