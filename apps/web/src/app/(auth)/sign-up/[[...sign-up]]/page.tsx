import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background py-12">
      <SignUp
        appearance={{
          elements: { rootBox: 'mx-auto', card: 'shadow-xl border border-border rounded-xl' },
        }}
      />
    </div>
  );
}
