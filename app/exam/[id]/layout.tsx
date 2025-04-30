export default function ExamLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="min-h-screen text-black">
        {children}
      </div>
    );
  }