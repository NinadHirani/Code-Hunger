import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import { FaGoogle, FaTimes } from "react-icons/fa";
import { signInWithGoogle } from "@/lib/firebase";
import { toast } from "react-toastify";

type AuthModalProps = {};

const AuthModal: React.FC<AuthModalProps> = () => {
  const [authModal, setAuthModal] = useRecoilState(authModalState);

  const closeModal = () => {
    setAuthModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      closeModal();
    } catch (error: any) {
      toast.error("Failed to sign in with Google");
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
      data-testid="auth-modal-backdrop"
    >
      <div className="bg-dark-layer-1 rounded-lg shadow-xl w-96 p-6 relative">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-dark-gray-6 hover:text-white"
          data-testid="close-modal-btn"
        >
          <FaTimes size={20} />
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-6">
            {authModal.type === "login" ? "Sign In" : 
             authModal.type === "register" ? "Sign Up" : "Reset Password"}
          </h2>

          {authModal.type === "forgotPassword" ? (
            <div>
              <p className="text-dark-gray-7 mb-4">
                Enter your email to reset your password
              </p>
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 rounded bg-dark-layer-2 border border-dark-divider-border-2 text-white mb-4 focus:outline-none focus:border-brand-orange"
                data-testid="email-input"
              />
              <button
                className="w-full bg-brand-orange hover:bg-brand-orange-s text-black font-semibold py-3 px-4 rounded transition-colors"
                data-testid="reset-password-btn"
              >
                Reset Password
              </button>
              <p className="text-sm text-dark-gray-6 mt-4">
                Remember your password?{" "}
                <button
                  onClick={() => setAuthModal({ isOpen: true, type: "login" })}
                  className="text-brand-orange hover:underline"
                  data-testid="back-to-login-btn"
                >
                  Sign In
                </button>
              </p>
            </div>
          ) : (
            <div>
              <button
                onClick={handleGoogleSignIn}
                className="w-full bg-white hover:bg-gray-100 text-black font-semibold py-3 px-4 rounded flex items-center justify-center space-x-2 transition-colors mb-4"
                data-testid="google-signin-btn"
              >
                <FaGoogle className="text-red-500" />
                <span>Sign in with Google</span>
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dark-divider-border-2"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-dark-layer-1 text-dark-gray-6">Or</span>
                </div>
              </div>

              <form className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 rounded bg-dark-layer-2 border border-dark-divider-border-2 text-white focus:outline-none focus:border-brand-orange"
                  data-testid="email-input"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full p-3 rounded bg-dark-layer-2 border border-dark-divider-border-2 text-white focus:outline-none focus:border-brand-orange"
                  data-testid="password-input"
                />
                {authModal.type === "register" && (
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full p-3 rounded bg-dark-layer-2 border border-dark-divider-border-2 text-white focus:outline-none focus:border-brand-orange"
                    data-testid="confirm-password-input"
                  />
                )}
                <button
                  type="submit"
                  className="w-full bg-brand-orange hover:bg-brand-orange-s text-black font-semibold py-3 px-4 rounded transition-colors"
                  data-testid="auth-submit-btn"
                >
                  {authModal.type === "login" ? "Sign In" : "Sign Up"}
                </button>
              </form>

              <div className="text-center mt-6">
                {authModal.type === "login" ? (
                  <div className="text-sm text-dark-gray-6">
                    <button
                      onClick={() => setAuthModal({ isOpen: true, type: "forgotPassword" })}
                      className="text-brand-orange hover:underline mr-4"
                      data-testid="forgot-password-btn"
                    >
                      Forgot Password?
                    </button>
                    <p className="mt-2">
                      Don't have an account?{" "}
                      <button
                        onClick={() => setAuthModal({ isOpen: true, type: "register" })}
                        className="text-brand-orange hover:underline"
                        data-testid="switch-to-register-btn"
                      >
                        Sign Up
                      </button>
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-dark-gray-6">
                    Already have an account?{" "}
                    <button
                      onClick={() => setAuthModal({ isOpen: true, type: "login" })}
                      className="text-brand-orange hover:underline"
                      data-testid="switch-to-login-btn"
                    >
                      Sign In
                    </button>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;