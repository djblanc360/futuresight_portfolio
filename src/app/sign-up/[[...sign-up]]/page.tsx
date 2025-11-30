import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#030304] text-[#FAE3C6] font-serif flex items-center justify-center">
      <div className="w-full max-w-md">
        <SignUp 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-[#222B39] border border-[#B97452]/50",
              headerTitle: "text-[#C17E3D]",
              headerSubtitle: "text-[#FAE3C6]/80",
              socialButtonsBlockButton: "bg-[#222B39] border border-[#B97452]/50 text-[#C17E3D] hover:bg-[#B97452]/20",
              formButtonPrimary: "bg-[#C17E3D] hover:bg-[#B97452] text-white",
              formFieldInput: "bg-[#030304] border-[#B97452]/50 text-[#FAE3C6]",
              formFieldLabel: "text-[#FAE3C6]",
              footerActionLink: "text-[#C17E3D] hover:text-[#B97452]",
            },
          }}
        />
      </div>
    </div>
  )
}

