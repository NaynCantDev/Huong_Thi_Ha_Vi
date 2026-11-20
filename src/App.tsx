import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { scrollToTop, useLenis } from './hooks/useLenis'
import { useReducedMotion } from './hooks/useReducedMotion'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Lesson1 from './pages/Lesson1'
import Lesson2 from './pages/Lesson2'
import Lesson3 from './pages/Lesson3'
import Lesson4 from './pages/Lesson4'
import Lesson5 from './pages/Lesson5'
import Lesson6 from './pages/Lesson6'
import Conclusion from './pages/Conclusion'
import NotFound from './pages/NotFound'

export default function App() {
  const location = useLocation()
  const reduce = useReducedMotion()
  useLenis(!reduce)

  useEffect(() => {
    if (!location.hash) scrollToTop()
  }, [location.pathname, location.hash])

  return (
    <>
      <a className="skip-link" href="#main">
        Bỏ qua đến nội dung
      </a>
      <Header />
      <MotionConfig reducedMotion="user">
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={() => document.getElementById('main')?.focus({ preventScroll: true })}
      >
        <motion.main
          id="main"
          key={location.pathname}
          tabIndex={-1}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/du-an" element={<Projects />} />
            <Route path="/du-an/bai-1" element={<Lesson1 />} />
            <Route path="/du-an/bai-2" element={<Lesson2 />} />
            <Route path="/du-an/bai-3" element={<Lesson3 />} />
            <Route path="/du-an/bai-4" element={<Lesson4 />} />
            <Route path="/du-an/bai-5" element={<Lesson5 />} />
            <Route path="/du-an/bai-6" element={<Lesson6 />} />
            <Route path="/tong-ket" element={<Conclusion />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
      </MotionConfig>
      <Footer />
    </>
  )
}
