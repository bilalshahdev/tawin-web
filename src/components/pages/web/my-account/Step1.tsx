import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTranslations } from "next-intl";
import { useUserProfile, useUpdateUserProfile, useVerifyOtp, useResendOtp } from "@/hooks/useAuth";
import { ProfileUpdateSchema, ProfileUpdate } from "@/validations/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShieldCheck, ShieldX, Mail, RotateCcw, CheckCircle2, ArrowRight } from "lucide-react";

export default function AccountInfo() {
  const t = useTranslations("translation");
  const { data: userProfile, isLoading, refetch } = useUserProfile();
  const { mutate: updateUserProfile, isPending: isUpdatingProfile } = useUpdateUserProfile();
  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOtp();
  const { mutate: resendOtp, isPending: isResending } = useResendOtp();

  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  // "info" = initial screen, "otp" = OTP entry screen, "success" = done
  const [step, setStep] = useState<"info" | "otp" | "success">("info");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isVerified = userProfile?.data?.isVerified ?? false;
  const email = userProfile?.data?.email ?? "";

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const id = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [resendTimer]);

  // Reset dialog state when closed
  const handleDialogChange = (open: boolean) => {
    setVerifyDialogOpen(open);
    if (!open) {
      setTimeout(() => {
        setStep("info");
        setOtp(["", "", "", "", "", ""]);
        setResendTimer(0);
      }, 300);
    }
  };

  // Send OTP → move to otp step
  const handleSendOtp = () => {
    resendOtp(email, {
      onSuccess: () => {
        setStep("otp");
        setResendTimer(60);
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      },
    });
  };

  // OTP input handlers
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const updated = [...otp];
    pasted.split("").forEach((char, i) => { updated[i] = char; });
    setOtp(updated);
    const nextEmpty = updated.findIndex((v) => !v);
    inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
  };

  const handleVerify = () => {
    const code = otp.join("");
    if (code.length < 6) return;
    verifyOtp(
      { email, otp: code },
      {
        onSuccess: () => {
          setStep("success");
          refetch();
        },
      }
    );
  };

  const handleResend = () => {
    resendOtp(email, {
      onSuccess: () => {
        setOtp(["", "", "", "", "", ""]);
        setResendTimer(60);
        setTimeout(() => inputRefs.current[0]?.focus(), 100);
      },
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileUpdate>({
    resolver: zodResolver(ProfileUpdateSchema),
    defaultValues: {
      firstName: userProfile?.data?.firstName || "",
      lastName: userProfile?.data?.lastName || "",
      username: userProfile?.data?.username || "",
    },
  });

  useEffect(() => {
    if (userProfile?.data && !isLoading) {
      reset({
        firstName: userProfile.data.firstName,
        lastName: userProfile.data.lastName,
        username: userProfile.data.username,
      });
    }
  }, [userProfile, isLoading, reset]);

  const onProfileUpdate = async (data: ProfileUpdate) => {
    try {
      await updateUserProfile(data);
      refetch();
    } catch (error) {}
  };

  const otpFilled = otp.every((d) => d !== "");

  return (
    <div className="space-y-12 animate-in fade-in duration-300">

      {/* ── Verification Status Badge ── (Hidden completely when user is verified) */}
      {!isVerified && (
        <div
          onClick={() => setVerifyDialogOpen(true)}
          className="flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md bg-yellow-500/10 border-yellow-500/30"
        >
          <div className="flex items-center gap-3">
            <ShieldX className="w-6 h-6 text-red" />
            <div>
              <p className="text-sm font-semibold text-red">
                Account Not Verified
              </p>
              <p className="text-xs mt-0.5 text-muted-foreground">
                Click to verify your account via email OTP.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-yellow-500/20 text-red">
              Pending
            </span>
            <ArrowRight className="w-4 h-4 text-red" />
          </div>
        </div>
      )}

      {/* ── Verification Dialog ── */}
      <Dialog open={verifyDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent className="sm:max-w-sm rounded-2xl p-0 overflow-hidden gap-0 bg-background border-border">

          {/* ── STEP: info ── */}
          {step === "info" && (
            <>
              <div className="px-6 pt-7 pb-5 text-center bg-yellow-500/10">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 bg-yellow-500/20">
                  <Mail className="w-7 h-7 text-red" />
                </div>
                <DialogTitle className="text-base font-semibold text-red">
                  Verify Your Account
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  We'll send a 6-digit code to your email
                </p>
              </div>

              <div className="px-6 py-5 space-y-4">
                <div className="rounded-lg bg-muted border border-border px-4 py-3 flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm text-foreground font-medium truncate">{email}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  A one-time password will be sent to the email address above. The code expires in 10 minutes.
                </p>
                <Button
                  className="w-full"
                  variant="primary"
                  onClick={handleSendOtp}
                  disabled={isResending}
                >
                  {isResending ? "Sending..." : "Send Verification Code"}
                </Button>
                <Button variant="ghost" className="w-full text-sm text-muted-foreground"
                  onClick={() => handleDialogChange(false)}>
                  Maybe later
                </Button>
              </div>
            </>
          )}

          {/* ── STEP: otp ── */}
          {step === "otp" && (
            <>
              <div className="px-6 pt-7 pb-5 text-center bg-aqua/10">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 bg-aqua/20">
                  <Mail className="w-7 h-7 text-navy" />
                </div>
                <DialogTitle className="text-base font-semibold text-navy">
                  Enter Verification Code
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Sent to <span className="font-semibold text-foreground">{email}</span>
                </p>
              </div>

              <div className="px-6 py-6 space-y-5">
                {/* OTP inputs */}
                <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-11 h-13 text-center text-lg font-bold border-2 rounded-xl outline-none transition-all bg-muted border-border text-foreground focus:border-aqua"
                      style={{
                        height: "52px",
                      }}
                    />
                  ))}
                </div>

                <Button
                  className="w-full"
                  variant="primary"
                  onClick={handleVerify}
                  disabled={!otpFilled || isVerifying}
                >
                  {isVerifying ? "Verifying..." : "Verify Account"}
                </Button>

                {/* Resend */}
                <div className="text-center">
                  {resendTimer > 0 ? (
                    <p className="text-xs text-muted-foreground">
                      Resend code in <span className="font-semibold text-foreground">{resendTimer}s</span>
                    </p>
                  ) : (
                    <button
                      onClick={handleResend}
                      disabled={isResending}
                      className="flex items-center gap-1.5 text-xs text-aqua hover:text-navy font-medium mx-auto transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      {isResending ? "Resending..." : "Resend code"}
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setStep("info")}
                  className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Back
                </button>
              </div>
            </>
          )}

          {/* ── STEP: success ── */}
          {step === "success" && (
            <div className="px-6 py-10 text-center space-y-4 bg-green-500/10">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto bg-green-500/20">
                <CheckCircle2 className="w-9 h-9 text-green" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-green">
                  Account Verified!
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Your identity has been confirmed. You now have full access to all platform features.
                </p>
              </div>
              <Button variant="primary" className="w-full mt-2"
                onClick={() => handleDialogChange(false)}>
                Continue
              </Button>
            </div>
          )}

        </DialogContent>
      </Dialog>

      {/* ── Account Info Form ── */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-foreground">{t("accountInformation")}</h2>
        <form onSubmit={handleSubmit(onProfileUpdate)} className="space-y-4" id="profile-form">
          <div className="space-y-2">
            <Label>{t("firstName")}*</Label>
            <Input placeholder={t("firstName")} {...register("firstName")}
              className="border-input rounded-md h-[50px] bg-background text-foreground"
              defaultValue={userProfile?.data?.firstName || ""}
              disabled={isLoading || isUpdatingProfile} />
            {errors.firstName && <p className="text-destructive text-sm">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>{t("lastName")}*</Label>
            <Input placeholder={t("lastName")} {...register("lastName")}
              className="border-input rounded-md h-[50px] bg-background text-foreground"
              defaultValue={userProfile?.data?.lastName || ""}
              disabled={isLoading || isUpdatingProfile} />
            {errors.lastName && <p className="text-destructive text-sm">{errors.lastName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>{t("username")}*</Label>
            <Input placeholder={t("username")} {...register("username")}
              className="border-input rounded-md h-[50px] bg-background text-foreground"
              defaultValue={userProfile?.data?.username || ""}
              disabled={isLoading || isUpdatingProfile} />
            {errors.username && <p className="text-destructive text-sm">{errors.username.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>{t("emailLabel")}*</Label>
            <Input placeholder={t("emailLabel")} type="email"
              value={userProfile?.data?.email || ""}
              className="border-input rounded-md h-[50px] bg-muted text-muted-foreground"
              disabled={true} readOnly />
          </div>
        </form>
      </section>

      {/* ── Password Section ── */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-foreground">{t("password")}</h2>
        <div className="space-y-4">
          <div className="space-y-2"><Label>{t("currentPassword")}</Label><Input type="password" placeholder={t("currentPassword")} className="border-input rounded-md h-[50px] bg-background text-foreground" /></div>
          <div className="space-y-2"><Label>{t("newPassword")}</Label><Input type="password" placeholder={t("newPassword")} className="border-input rounded-md h-[50px] bg-background text-foreground" /></div>
          <div className="space-y-2"><Label>{t("reEnterPassword")}</Label><Input type="password" placeholder={t("reEnterPassword")} className="border-input rounded-md h-[50px] bg-background text-foreground" /></div>
        </div>
      </section>

      <Button variant="primary" className="w-42" type="submit" form="profile-form"
        disabled={isLoading || isUpdatingProfile}>
        {isUpdatingProfile ? "Saving..." : t("saveChanges")}
      </Button>
    </div>
  );
}