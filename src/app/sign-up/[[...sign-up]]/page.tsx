import { SignUp } from "@clerk/nextjs";

const theme = {
  bgColor: "#0a0a0f",
  textColor: "#00ff41",
  linkColor: "#ff0080",
  headerColor: "#00ffff",
  borderColor: "#ff00ff",
  accentColor: "#ffff00",
  boxBg: "#1a0a2e",
};

export default function SignUpPage() {
  return (
    <div style={{ 
      backgroundColor: theme.bgColor, 
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{ maxWidth: "400px", width: "100%" }}>
        <div className="text-center mb-6">
          <h1 style={{ 
            color: theme.headerColor, 
            fontSize: "24px", 
            fontWeight: "bold",
            marginBottom: "8px"
          }}>
            🤖 LiTreeLabStudios
          </h1>
          <p style={{ color: theme.textColor, fontSize: "12px" }}>
            Create your account to start building with AI agents
          </p>
        </div>
        
        <div style={{
          border: `2px solid ${theme.borderColor}`,
          backgroundColor: theme.boxBg,
          padding: "20px"
        }}>
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: {
                  backgroundColor: theme.linkColor,
                  color: "white",
                  border: "none",
                  fontSize: "12px",
                  fontWeight: "bold",
                },
                formFieldInput: {
                  backgroundColor: "rgba(0,0,0,0.5)",
                  border: `1px solid ${theme.borderColor}`,
                  color: "white",
                },
                footerActionLink: {
                  color: theme.linkColor,
                },
                headerTitle: {
                  color: theme.headerColor,
                },
                headerSubtitle: {
                  color: theme.textColor,
                },
                socialButtonsBlockButton: {
                  border: `1px solid ${theme.borderColor}`,
                  backgroundColor: "transparent",
                },
              },
              variables: {
                colorPrimary: theme.linkColor,
                colorBackground: theme.boxBg,
                colorText: "white",
                colorTextSecondary: theme.textColor,
                colorInputBackground: "rgba(0,0,0,0.5)",
                colorInputText: "white",
                borderRadius: "0",
                fontFamily: "Verdana, Arial, sans-serif",
              },
            }}
          />
        </div>
        
        <div className="text-center mt-4">
          <a 
            href="/" 
            style={{ 
              color: theme.linkColor, 
              fontSize: "11px",
              textDecoration: "none"
            }}
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
