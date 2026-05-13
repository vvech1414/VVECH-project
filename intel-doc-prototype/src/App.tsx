import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import type { ReactNode } from 'react'
import DemoToolbar from './components/system/DemoToolbar'
import Welcome from './routes/patient/entry/Welcome'
import Account from './routes/patient/entry/Account'
import Access from './routes/patient/entry/Access'
import Consents from './routes/patient/entry/Consents'
import { VasilyOnboardingScreen } from './features/vasily-onboarding'
import Setup from './routes/patient/entry/Setup'
import Home from './routes/patient/Home'
import VasilyHelper from './routes/patient/VasilyHelper'
import Checklist from './routes/patient/Checklist'
import History from './routes/patient/History'
import Notifications from './routes/patient/Notifications'
import AnalysisCardScreen from './routes/patient/AnalysisCardScreen'
import UploadFlow from './routes/patient/UploadFlow'
import DocUpload from './routes/patient/DocUpload'
import NotificationAction from './routes/patient/NotificationAction'
import BookMain from './routes/patient/BookMain'
import ServicePlaceholder from './routes/patient/ServicePlaceholder'
import Profile from './routes/patient/Profile'
import ExtraDoctors from './routes/patient/ExtraDoctors'
import { useInteldoc } from './store/store'
import { SEGMENTS } from './store/segments'

function DemoDeepLink() {
  const { pathname, search } = useLocation()
  const nav = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(search)
    if (pathname !== '/patient/home' || params.get('demo') !== 'home') return

    const prepSegment = SEGMENTS.find((s) => s.id === 2)
    if (!prepSegment) return

    void Promise.resolve(prepSegment.apply()).then((route) => {
      nav(route, { replace: true })
    })
  }, [nav, pathname, search])

  return null
}

function OnboardingGate({ children }: { children: ReactNode }) {
  const { pathname, search } = useLocation()
  const completed = useInteldoc((s) => s.hasCompletedOnboarding)

  const isEntry = pathname.startsWith('/patient/entry')
  const isDemoHome =
    pathname === '/patient/home' && new URLSearchParams(search).get('demo') === 'home'
  const isPatientNonEntry =
    pathname.startsWith('/patient') && !isEntry

  if (!completed && isPatientNonEntry && !isDemoHome) {
    return <Navigate to="/patient/entry/welcome" replace />
  }
  const isAllowedCompletedEntry =
    pathname === '/patient/entry/vasily-onboarding' ||
    pathname === '/patient/entry/setup'

  if (completed && isEntry && !isAllowedCompletedEntry) {
    return <Navigate to="/patient/home" replace />
  }
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <DemoDeepLink />
      <OnboardingGate>
        <Routes>
          <Route path="/" element={<Navigate to="/patient/entry/welcome" replace />} />

          {/* Patient onboarding */}
          <Route path="/patient/entry" element={<Navigate to="/patient/entry/welcome" replace />} />
          <Route path="/patient/entry/welcome" element={<Welcome />} />
          <Route path="/patient/entry/account" element={<Account />} />
          <Route path="/patient/entry/access" element={<Access />} />
          <Route path="/patient/entry/consents" element={<Consents />} />
          <Route path="/patient/entry/vasily-onboarding" element={<VasilyOnboardingScreen />} />
          <Route path="/patient/entry/setup" element={<Setup />} />

          {/* Patient app (post-onboarding) */}
          <Route path="/patient/home" element={<Home />} />
          <Route path="/patient/vasily" element={<VasilyHelper />} />
          <Route path="/patient/history" element={<History />} />
          <Route path="/patient/notifications" element={<Notifications />} />
          <Route path="/patient/history/:analysisId" element={<AnalysisCardScreen />} />
          <Route path="/patient/checklist" element={<Checklist />} />
          <Route path="/patient/upload" element={<UploadFlow />} />
          <Route path="/patient/upload/:type" element={<UploadFlow />} />
          <Route path="/patient/doc-upload" element={<DocUpload />} />
          <Route path="/patient/doc-upload/:type" element={<DocUpload />} />
          <Route path="/patient/notification/:requestId" element={<NotificationAction />} />
          <Route path="/patient/book" element={<BookMain />} />
          <Route path="/patient/extra-doctors" element={<ExtraDoctors />} />
          <Route path="/patient/service/:slug" element={<ServicePlaceholder />} />
          <Route path="/patient/profile" element={<Profile />} />

          <Route path="*" element={<Navigate to="/patient/entry/welcome" replace />} />
        </Routes>
      </OnboardingGate>
      <DemoToolbar />
    </BrowserRouter>
  )
}
