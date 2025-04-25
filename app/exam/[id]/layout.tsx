export default function ExamLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="min-h-screen bg-white text-black">
        {children}
      </div>
    );
  }