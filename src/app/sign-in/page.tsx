import AuthFormContent from '@/components/forms/auth-form-content'
import connectDB from '@/db'

async function SignInPage (): Promise<React.ReactNode> {
  await connectDB()
  return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden'>
      {/* Subtle animated decorations */}
      <div className='absolute inset-0 pointer-events-none overflow-hidden opacity-40'>
        <div className='absolute top-20 left-10 text-4xl animate-bounce'>🎮</div>
        <div className='absolute top-32 right-20 text-3xl animate-pulse'>👾</div>
        <div className='absolute bottom-40 left-20 text-3xl animate-bounce' style={{ animationDelay: '1s' }}>🧸</div>
        <div className='absolute bottom-20 right-10 text-4xl animate-pulse' style={{ animationDelay: '2s' }}>🦄</div>
      </div>

      {/* Main card container */}
      <div className='w-full max-w-md relative z-10'>
        <div className='bg-white rounded-2xl shadow-lg border border-slate-200 p-8 relative overflow-hidden'>
          {/* Simple top border accent */}
          <div className='absolute top-0 left-0 right-0 h-1 bg-slate-900' />

          {/* Welcome message */}
          <div className='text-center mb-8'>
            <div className='text-5xl mb-4'>🎮</div>
            <h1 className='text-3xl font-bold text-slate-900'>
              Bienvenue !
            </h1>
            <p className='text-slate-600 mt-2 text-sm'>
              Vos petits monstres vous attendent 👹✨
            </p>
          </div>

          <AuthFormContent />
        </div>

        {/* Fun quote below the card */}
        <div className='text-center mt-6 text-slate-500 text-sm'>
          <span className='italic'>"Un monstre par jour éloigne l'ennui pour toujours !"</span> 🎭
        </div>
      </div>
    </div>
  )
}

export default SignInPage
