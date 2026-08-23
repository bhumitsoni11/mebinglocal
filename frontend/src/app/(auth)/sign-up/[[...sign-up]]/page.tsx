import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="w-full">
      <SignUp
        appearance={{
          variables: {
            colorPrimary: '#C96F52',
            colorForeground: '#1A3B2B',
            colorBackground: 'transparent',
            colorInput: '#F4E9D8',
            colorInputForeground: '#1A3B2B',
            borderRadius: '0.25rem',
          },
          elements: {
            cardBox: "!shadow-none !bg-transparent !w-full",
            card: "!shadow-none !bg-transparent !p-0 !w-full !max-w-sm !mx-0",
            header: "!hidden",
            footer: "!hidden",
            socialButtonsBlockButton: "!bg-white !border-gray-300 text-[#1A3B2B] hover:!bg-gray-50 !shadow-sm",
            formButtonPrimary: "!shadow-none font-medium !py-3 text-white hover:!bg-[#B35E42]",
            formFieldInput: "!border-transparent focus:!border-[#C96F52] focus:!ring-[#C96F52] !py-3",
            dividerLine: "!bg-gray-300",
            formFieldLabel: "text-[#1A3B2B] font-medium",
          }
        }}
      />
      <div className="mt-8 text-left">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/sign-in" className="font-semibold text-[#C96F52] hover:text-[#B35E42] transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
