import { Typography } from "antd";
import React from "react";

function AppFooter() {
  // Define base styles
  const baseFooterStyle = {
    padding: "20px 10px",
    backgroundColor: "#f0f2f5",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const baseLinkStyle = {
    margin: "8px 0",
    color: "#1890ff",
    textDecoration: "none",
    fontSize: "16px",
    display: "block",
    transition: "color 0.3s",
  };

  const baseDescriptionStyle = {
    color: "#595959",
    fontSize: "14px",
    margin: "8px 0",
    textAlign: "center",
    maxWidth: "80%",
    lineHeight: "1.5",
  };

  // Define state for styles
  const [styles, setStyles] = React.useState({
    footerStyle: baseFooterStyle,
    linkStyle: baseLinkStyle,
    descriptionStyle: baseDescriptionStyle,
  });

  const handleResize = () => {
    if (window.innerWidth <= 768) {
      setStyles({
        footerStyle: { ...baseFooterStyle, padding: "15px 10px" },
        linkStyle: { ...baseLinkStyle, fontSize: "14px" },
        descriptionStyle: { ...baseDescriptionStyle, fontSize: "12px" },
      });
    } else {
      setStyles({
        footerStyle: baseFooterStyle,
        linkStyle: baseLinkStyle,
        descriptionStyle: baseDescriptionStyle,
      });
    }
  };

  React.useEffect(() => {
    handleResize(); // Set initial styles based on window size
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div style={styles.footerStyle}>
      <Typography.Link href="tel:076652 31743" style={styles.linkStyle}>
        076652 31743
      </Typography.Link>
      <Typography style={styles.descriptionStyle}>
        "BookMySafety™, TheSafetyMaster™ & TheSafetyGuru™ are trademarks of TSM TheSafetyMaster Private Limited"
      </Typography>
      <Typography.Link
        href="https://www.thesafetymaster.com/"
        target="_blank"
        style={styles.linkStyle}
      >
        © 2024 TSM TheSafetyMaster Private Limited. All Rights Reserved.
      </Typography.Link>
      <Typography.Link
        href="https://www.thesafetymaster.com/privacy-policy/"
        target="_blank"
        style={styles.linkStyle}
      >
        Privacy Policy
      </Typography.Link>
    </div>
  );
}

export default AppFooter;
