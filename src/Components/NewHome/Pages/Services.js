import React, { useEffect, useState } from "react";
import {
  FaShieldAlt,
  FaCheckCircle,
  FaClock,
  FaFolderOpen,
  FaBell,
  FaChartBar,
} from "react-icons/fa";

const Services = () => {
  const [header] = useState({
    subHeading: "Why Choose Our Permit to Work Software?",
    text: "Our PTW software simplifies permit management, ensuring safety and compliance while speeding up approval processes. Centralize documentation and stay updated with real-time notifications to enhance operational efficiency and safety.",
  });
  const [state] = useState([
    {
      id: 1,
      icon: <FaShieldAlt className="commonIcons" />,
      heading: "Enhanced Safety Compliance",
      text: "Our software ensures all tasks comply with the latest safety regulations, reducing risks and promoting a safer work environment.",
    },
    {
      id: 2,
      icon: <FaCheckCircle className="commonIcons" />,
      heading: "Streamlined Approval Processes",
      text: "Simplify and accelerate the permit approval process with our intuitive platform, reducing delays and getting work started faster.",
    },
    {
      id: 3,
      icon: <FaClock className="commonIcons" />,
      heading: "Real-Time Tracking and Updates",
      text: "Monitor permit statuses and receive real-time updates, keeping you informed and in control of your operations at all times.",
    },
    {
      id: 4,
      icon: <FaFolderOpen className="commonIcons" />,
      heading: "Centralized Documentation",
      text: "Manage and access all permit documents from a single, easy-to-use platform, making retrieval and organization seamless.",
    },
    {
      id: 5,
      icon: <FaBell className="commonIcons" />,
      heading: "Automated Notifications",
      text: "Automate notifications and reminders for key dates and approvals, ensuring you stay on top of critical tasks and deadlines.",
    },
    {
      id: 6,
      icon: <FaChartBar className="commonIcons" />,
      heading: "Comprehensive Reporting and Analytics",
      text: "Generate detailed reports and analytics to track performance and trends, helping you make informed decisions and improve processes.",
    },
  ]);

  useEffect(() => {
    const handleScroll = () => {
      const boxes = document.querySelectorAll(".services__box");
      boxes.forEach((box) => {
        const boxTop = box.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (boxTop < windowHeight - 100) {
          box.classList.add("in-view");
        } else {
          box.classList.remove("in-view");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="services">
      <div className="container">
        <div className="services__header">
          <div className="common">
            <h1 className="mainHeader">{header.subHeading}</h1>
            <p className="mainContent">{header.text}</p>
            <div className="commonBorder"></div>
          </div>
          <div className="row bgMain">
            {state.map((info) => (
              <div className="col-4 bgMain" key={info.id}>
                <div className="services__box">
                  {info.icon}
                  <div className="services__box-header">{info.heading}</div>
                  <div className="services__box-p">{info.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
