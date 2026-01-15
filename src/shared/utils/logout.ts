import { deleteCookie } from '@/shared/lib/cookie'
import { Authenticate } from '@/shared/constants/auth'

export const logout = () => {
    deleteCookie(Authenticate.AUTH)
    localStorage.clear()
    window.location.href = '/react-app/login'
}
