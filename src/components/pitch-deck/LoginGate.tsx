"use client";

import React, { useState } from "react";
import { Lock, LogIn, X, ShieldCheck } from "lucide-react";
import { useLocale } from "next-intl";
import { useDeckAccess } from "./DeckAccessProvider";
import { LoginModal } from "@/components/auth/login-modal";
import { siteConfig } from "@/config/site";

// ─── i18n copy ────────────────────────────────────────────────────────────────
const GATE_COPY: Record<
  string,
  {
    title: string;
    descUser: string;
    descAdmin: string;
    cta: string;
    dismiss: string;
    preview: string;
  }
> = {
  en: {
    title: "Content Restricted",
    descUser: "Sign in to view the full presentation.",
    descAdmin:
      "This content is restricted to administrators. Please sign in with an authorized account.",
    cta: "Sign In",
    dismiss: "Back to Preview",
    preview: "preview slides available",
  },
  zh: {
    title: "内容受限",
    descUser: "请登录以查看完整演示。",
    descAdmin: "此内容仅限管理员查看，请使用授权帐号登录。",
    cta: "登录",
    dismiss: "返回预览",
    preview: "页预览可用",
  },
  ja: {
    title: "コンテンツ制限",
    descUser: "完全なプレゼンテーションを表示するにはサインインしてください。",
    descAdmin:
      "このコンテンツは管理者に限定されています。認証済みアカウントでサインインしてください。",
    cta: "サインイン",
    dismiss: "プレビューに戻る",
    preview: "スライドプレビュー可能",
  },
  ko: {
    title: "콘텐츠 제한",
    descUser: "전체 프레젠테이션을 보려면 로그인하세요.",
    descAdmin:
      "이 콘텐츠는 관리자만 볼 수 있습니다. 인증된 계정으로 로그인하세요.",
    cta: "로그인",
    dismiss: "미리보기로 돌아가기",
    preview: "슬라이드 미리보기 가능",
  },
};

// ─── Dict for LoginModal ──────────────────────────────────────────────────────
const LOGIN_DICT: Record<string, Record<string, string>> = {
  en: {
    loginTitle: "Welcome back",
    signupTitle: "Create an account",
    loginDesc: "Sign in to your account",
    signupDesc: "Enter your email below to create your account",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    signIn: "Sign In",
    signUp: "Sign Up",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    signUpNow: "Sign Up Now",
    signInNow: "Sign In Now",
    forgotPassword: "Forgot password?",
  },
  zh: {
    loginTitle: "欢迎回来",
    signupTitle: "创建账号",
    loginDesc: "登录您的账号",
    signupDesc: "输入邮箱地址创建账号",
    email: "邮箱",
    password: "密码",
    confirmPassword: "确认密码",
    signIn: "登录",
    signUp: "注册",
    noAccount: "没有账号？",
    hasAccount: "已有账号？",
    signUpNow: "立即注册",
    signInNow: "立即登录",
    forgotPassword: "忘记密码？",
  },
  ja: {
    loginTitle: "おかえりなさい",
    signupTitle: "アカウント作成",
    loginDesc: "アカウントにサインイン",
    signupDesc: "メールアドレスを入力してアカウントを作成",
    email: "メール",
    password: "パスワード",
    confirmPassword: "パスワード確認",
    signIn: "サインイン",
    signUp: "サインアップ",
    noAccount: "アカウントをお持ちでない方は",
    hasAccount: "アカウントをお持ちの方は",
    signUpNow: "今すぐ登録",
    signInNow: "今すぐサインイン",
    forgotPassword: "パスワードをお忘れですか？",
  },
  ko: {
    loginTitle: "다시 오신 걸 환영합니다",
    signupTitle: "계정 만들기",
    loginDesc: "계정에 로그인",
    signupDesc: "이메일을 입력하여 계정을 만드세요",
    email: "이메일",
    password: "비밀번호",
    confirmPassword: "비밀번호 확인",
    signIn: "로그인",
    signUp: "가입",
    noAccount: "계정이 없으신가요?",
    hasAccount: "이미 계정이 있으신가요?",
    signUpNow: "지금 가입",
    signInNow: "지금 로그인",
    forgotPassword: "비밀번호를 잊으셨나요?",
  },
};

// ─── LoginGate Component ──────────────────────────────────────────────────────
/**
 * Full-screen overlay that appears when a user tries to navigate past the
 * preview slide limit. Renders on top of the deck slides (z-50).
 *
 * Shows a blur backdrop with access info and a "Sign In" button that opens
 * the existing LoginModal.
 */
export function LoginGate({ onBack, locale: localeProp }: { onBack?: () => void; locale?: string }) {
  const { access, previewSlides, gateOpen, hideGate } = useDeckAccess();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  let locale: string;
  if (localeProp) {
    locale = localeProp;
  } else {
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      locale = useLocale();
    } catch {
      locale = "en";
    }
  }

  const copy = GATE_COPY[locale] ?? GATE_COPY.en;
  const dict = LOGIN_DICT[locale] ?? LOGIN_DICT.en;

  const specificProviders =
    siteConfig.oauth.regionSpecific[locale] || [];
  const commonProviders = siteConfig.oauth.common;

  if (!gateOpen) return null;

  const desc = access === "admin" ? copy.descAdmin : copy.descUser;

  const handleBack = () => {
    hideGate();
    onBack?.();
  };

  return (
    <>
      {/* Full-screen gate overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
          onClick={handleBack}
        />
        {/* Card */}
        <div className="relative z-10 mx-4 w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/95 p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
          {/* Close */}
          <button
            onClick={handleBack}
            className="absolute top-3 right-3 p-1.5 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-blue-600/15 p-4">
              {access === "admin" ? (
                <ShieldCheck className="w-8 h-8 text-blue-400" />
              ) : (
                <Lock className="w-8 h-8 text-blue-400" />
              )}
            </div>
          </div>

          {/* Copy */}
          <h3 className="text-center text-lg sm:text-xl font-semibold text-white mb-2">
            {copy.title}
          </h3>
          <p className="text-center text-sm text-white/60 mb-2 leading-relaxed">
            {desc}
          </p>
          <p className="text-center text-xs text-white/30 mb-6">
            {previewSlides} {copy.preview}
          </p>

          {/* CTA */}
          <button
            onClick={() => setLoginModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            {copy.cta}
          </button>

          {/* Dismiss */}
          <button
            onClick={handleBack}
            className="w-full mt-3 py-2 text-center text-xs text-white/40 hover:text-white/60 transition-colors cursor-pointer"
          >
            {copy.dismiss}
          </button>
        </div>
      </div>

      {/* LoginModal — renders inside a Dialog portal, so z-index is independent */}
      <LoginModal
        open={loginModalOpen}
        onOpenChange={(open) => {
          setLoginModalOpen(open);
          // If the modal was closed AND user is now authenticated,
          // the DeckAccessProvider will pick up the auth change automatically
          // and canView will update — the gate overlay will be hidden
          // by the deck's goTo logic on retry.
        }}
        specificProviders={specificProviders}
        commonProviders={commonProviders}
        isSignup={false}
        dict={dict}
      />
    </>
  );
}
