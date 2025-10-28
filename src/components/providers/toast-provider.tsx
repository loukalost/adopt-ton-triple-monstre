/**
 * Toast Provider Configuration
 * Centralized toast notification setup following Clean Architecture
 * Single Responsibility: Only handles toast configuration and provider
 */

'use client'

import { ToastContainer, type ToastContainerProps } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

/**
 * Custom toast configuration aligned with project theme
 */
const toastConfig: ToastContainerProps = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'light',
  style: {
    fontFamily: 'inherit'
  }
}

/**
 * Toast Provider Component
 * Wrap your app with this to enable toast notifications
 */
export default function ToastProvider (): React.ReactNode {
  return <ToastContainer {...toastConfig} />
}
