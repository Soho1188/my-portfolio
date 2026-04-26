import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ModeToggle } from "@/components/theme-provider";
import {
  AlertCircle,
  Calendar,
  Code,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Server,
  UserCircle,
  Terminal,
  Coffee,
  Braces,
  GitBranch,
  LayoutGrid,
  Globe,
  Award,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

// Matrix digital rain background
const MatrixBackground = () => {
  const characters =
    "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヰヱヲ";

  const columns = Array.from({ length: 40 }, (_, i) => i);

  return (
    <div className="fixed inset-0 z-0 opacity-10 overflow-hidden">
      {columns.map((col) => {
        const randomChars = Array.from(
          { length: Math.floor(Math.random() * 30) + 5 },
          () => characters[Math.floor(Math.random() * characters.length)],
        );
        const delay = Math.random() * 5;

        return (
          <div
            key={col}
            className="absolute top-0 text-primary text-xl font-mono"
            style={
              {
                left: `${col * 2.5}%`,
                "--delay": delay,
              } as React.CSSProperties
            }
          >
            {randomChars.map((char, i) => (
              <div
                key={i}
                className="matrix-drop"
                style={
                  {
                    "--delay": delay + i * 0.1,
                  } as React.CSSProperties
                }
              >
                {char}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

// Typing animation component
const TypedText = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    // Create blinking cursor
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 250); // 2x faster blinking (was 500ms)

    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    const typingSpeed = isDeleting ? 50 : 100;

    const timer = setTimeout(() => {
      if (!isDeleting && displayText === text) {
        // Wait before starting to delete
        const pauseTimer = setTimeout(() => setIsDeleting(true), 2000);
        return () => clearTimeout(pauseTimer);
      } else if (isDeleting && displayText === "") {
        // Reset after fully deleted
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        return;
      }

      setDisplayText((prev) => {
        if (isDeleting) {
          return prev.substring(0, prev.length - 1);
        } else {
          return text.substring(0, prev.length + 1);
        }
      });
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, text, loopNum]);

  return (
    <span className="text-primary">
      {displayText}
      {cursorVisible && <span className="animate-blink">_</span>}
    </span>
  );
};

// Loading animation component
interface LoadingScreenProps {
  onProgress: (value: number) => void;
}

const LoadingScreen = ({ onProgress }: LoadingScreenProps) => {
  const [commandLines, setCommandLines] = useState<string[]>([""]);
  const [currentCommand, setCurrentCommand] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [progressValue, setProgressValue] = useState(5);

  // Terminal commands to display
  const commands = useMemo(
    () => ["Initializing development environment..."],
    [],
  );

  useEffect(() => {
    // Update the parent's progress value
    onProgress(progressValue);

    // Blink cursor effect
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, [progressValue, onProgress]);

  useEffect(() => {
    if (!isTyping) return;

    if (currentCommand < commands.length) {
      const timer = setTimeout(() => {
        const fullCommand = commands[currentCommand];

        if (charIndex < fullCommand.length) {
          setDisplayText(fullCommand.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
          setProgressValue(
            5 + (currentCommand * 15 + (charIndex / fullCommand.length) * 90),
          );
        } else {
          setIsTyping(false);

          setTimeout(() => {
            setCommandLines((prev) => [...prev, `> ${fullCommand}`]);

            if (currentCommand < commands.length - 1) {
              setCurrentCommand(currentCommand + 1);
              setCharIndex(0);
              setDisplayText("");
              setIsTyping(true);
            } else {
              setCommandLines((prev) => [
                ...prev,
                "> Process completed successfully",
              ]);
              setProgressValue(100);
              setDisplayText(""); // Add this line to clear displayText
              return;
            }
          }, 1); // was 125ms, now faster
        }
      }, 1); // was 8ms, now even faster typing
      return () => clearTimeout(timer);
    }
  }, [currentCommand, charIndex, isTyping, commands]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-terminal-bg z-50">
      <MatrixBackground />

      <div className="w-full max-w-3xl p-4 z-10">
        <div className="terminal">
          <div className="terminal-header">
            <div className="terminal-button terminal-close"></div>
            <div className="terminal-button terminal-minimize"></div>
            <div className="terminal-button terminal-maximize"></div>
          </div>
          <div className="terminal-content">
            <pre className="whitespace-pre-wrap font-mono text-terminal-text">
              {/* Previous commands */}
              {commandLines.map((line: string, i: number) => (
                <div key={i}>{line}</div>
              ))}

              {/* Current command being typed */}
              {currentCommand < commands.length && (
                <div>
                  {`> ${displayText}`}
                  {isTyping && showCursor && (
                    <span className="animate-blink">_</span>
                  )}
                </div>
              )}
            </pre>
          </div>
        </div>

        <div className="mt-8">
          <div className="w-full h-2 bg-background rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: "5%" }}
              animate={{ width: `${progressValue}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="mt-2 text-center text-primary font-mono text-sm">
            LOADING PORTFOLIO {Math.round(progressValue)}%
          </div>
        </div>
      </div>
    </div>
  );
};

interface SkillItemProps {
  name: string;
  level: number;
  icon?: React.ReactNode;
}

const SkillItem = ({ name, level, icon }: SkillItemProps) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <div className="flex items-center">
          {icon && <span className="mr-2 text-primary">{icon}</span>}
          <span className="text-sm font-medium">{name}</span>
        </div>
        <span className="text-sm text-muted-foreground">{level}%</span>
      </div>
      <div className="relative">
        <Progress value={level} className="h-2" />
        <div
          className="absolute top-0 left-0 h-full opacity-20 data-flow"
          style={{ width: `${level}%` }}
        ></div>
      </div>
    </div>
  );
};

interface Project {
  title: string;
  description: string;
  tags: string[];
  overview: string;
  problemSolved: string;
  flowSteps: string[];
  techStack: string[];
  architectureImage?: string;
  projectType: string;
}

interface Skill {
  name: string;
  level: number;
  icon: React.ReactNode;
}

const Resume = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [progressValue, setProgressValue] = useState(0);
  const [profileImageError, setProfileImageError] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const profileImageSrc = "/profile.jpg";
  const flowBoxWidth = 170;
  const flowBoxHeight = 44;
  const flowGap = 48;

  useEffect(() => {
    // Only disable loading when we've actually finished all commands
    // This ensures the full animation plays
    if (progressValue === 100) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 375); // 4x faster (was 1500ms)

      return () => clearTimeout(timer);
    }
  }, [progressValue]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const mainSkills: Skill[] = [
    { name: "Infrastructure as Code", level: 85, icon: <Braces size={16} /> },
    {
      name: "Cloud Networking & Security",
      level: 85,
      icon: <Globe size={16} />,
    },
    { name: "CI/CD & Automation", level: 80, icon: <GitBranch size={16} /> },
    {
      name: "Containerization & Virtualization",
      level: 80,
      icon: <LayoutGrid size={16} />,
    },
    { name: "Linux & Scripting", level: 80, icon: <Terminal size={16} /> },
    {
      name: "Monitoring & Observability",
      level: 75,
      icon: <AlertCircle size={16} />,
    },
  ];

  const projects: Project[] = [
    {
      title: "Automated CI/CD Pipeline — Flask App on AWS",
      description:
        "Deployed a two-tier Flask and MySQL application on AWS EC2 with a fully automated pipeline. Every code push triggers a build and deployment automatically with zero manual steps.",
      tags: ["AWS EC2", "Docker", "Jenkins", "CI/CD", "GitHub"],
      overview:
        "A two-tier web application with a Flask frontend and MySQL database, containerized with Docker and deployed on AWS EC2. The entire deployment is automated through a Jenkins CI/CD pipeline triggered by GitHub pushes.",
      problemSolved:
        "Manual deployments were slow and error-prone. This pipeline removes human intervention by automatically pulling code, building a Docker image, and bringing up application containers after each push.",
      flowSteps: [
        "GitHub Push",
        "Jenkins Detects Change",
        "Build Docker Image",
        "Docker Compose Up",
        "App Live on EC2",
      ],
      techStack: [
        "AWS EC2",
        "Docker",
        "Docker Compose",
        "Jenkins",
        "Flask",
        "MySQL",
        "GitHub",
        "Python",
      ],
      architectureImage: "/cicd-architecture.svg",
      projectType: "Featured Project",
    },
  ];

  if (loading) {
    return (
      <LoadingScreen onProgress={(value: number) => setProgressValue(value)} />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 grid-background opacity-10"></div>
      <MatrixBackground />

      <div className="relative z-10">
        {/* Header */}
        <header className="max-w-6xl mx-auto pt-16 pb-12 px-4">
          <motion.div
            className="flex flex-col md:flex-row items-center justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-chart-1 to-chart-3 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  {profileImageError ? (
                    <span>SK</span>
                  ) : (
                    <img
                      src={profileImageSrc}
                      alt="Soheila Kamali profile"
                      className="w-full h-full object-cover"
                      onError={() => setProfileImageError(true)}
                    />
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-chart-2 rounded-full w-6 h-6 border-2 border-background pulse-animation"></div>
              </div>
              <div className="text-center md:text-left">
                <motion.h1
                  className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-chart-1 to-chart-3 pb-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  Soheila Kamali
                </motion.h1>
                <h2 className="text-xl md:text-2xl mt-2 text-muted-foreground flex items-center justify-center md:justify-start">
                  <Terminal className="mr-2 text-primary" size={20} />
                  <TypedText text="Cloud Engineer" />
                </h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                  <Badge
                    variant="outline"
                    className="border-chart-5 text-chart-5 hover-glow"
                  >
                    AWS/Azure
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-chart-5 text-chart-5 hover-glow"
                  >
                    IaC
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-chart-5 text-chart-5 hover-glow"
                  >
                    CI/CD
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-chart-5 text-chart-5 hover-glow"
                  >
                    Docker
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-chart-5 text-chart-5 hover-glow"
                  >
                    Cloud Security & IAM
                  </Badge>
                </div>
              </div>
            </div>
            <div className="mt-8 md:mt-0 flex gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href="mailto:soheila.k@hotmail.ca"
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-card hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Mail size={18} />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>soheila.k@hotmail.ca</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href="tel:6478945420"
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-card hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Phone size={18} />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>647-894-5420</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href="https://www.linkedin.com/soheila-kamali"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-card hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Linkedin size={18} />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>linkedin.com/in/soheila-kamali</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href="https://github.com/soho1188"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-card hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Github size={18} />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>GitHub Profile</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href="#"
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-card hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <MapPin size={18} />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mississauga, Ontario, Canada</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    asChild
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-card hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <ModeToggle />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle Theme</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </motion.div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 pb-16">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5 mb-8 items-start pb-9">
              <TabsTrigger value="about" className="text-sm md:text-base">
                About Me
              </TabsTrigger>
              <TabsTrigger value="experience" className="text-sm md:text-base">
                Experience
              </TabsTrigger>
              <TabsTrigger value="skills" className="text-sm md:text-base">
                Skills
              </TabsTrigger>
              <TabsTrigger value="projects" className="text-sm md:text-base">
                Projects
              </TabsTrigger>
              <TabsTrigger value="education" className="text-sm md:text-base">
                Education
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <div>
                <TabsContent value="about">
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                  >
                    <motion.div
                      variants={itemVariants}
                      className="md:col-span-3"
                    >
                      <Card className="bg-card border-border hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="border-b border-border">
                          <CardTitle className="flex items-center gap-2">
                            <UserCircle className="text-primary" size={20} />
                            About Me
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <p className="text-card-foreground leading-relaxed">
                            Cloud engineering found me through a mix of
                            curiosity and problem-solving. I've always been
                            drawn to the idea that the right infrastructure
                            setup can make everything faster, cheaper, and more
                            reliable without anyone even noticing the work
                            behind it
                          </p>
                          <p className="mt-4 text-card-foreground leading-relaxed">
                            My background in software development and networking
                            at Sheridan College gave me a foundation that goes
                            beyond just deploying services. I understand how
                            applications are built, how networks are designed,
                            and how infrastructure ties it all together. That's
                            what led me into cloud and what shaped how I
                            approach it. Since then I've worked on platforms
                            where cloud solved real problems, from using
                            serverless architecture to scale a growing startup
                            while cutting costs, to designing infrastructure
                            that kept thousands of users online without missing
                            a beat.
                          </p>
                          <p className="mt-4 text-card-foreground leading-relaxed">
                            What I enjoy most is finding where things are slow,
                            expensive, or fragile and fixing them through
                            automation and smart architecture. I work across
                            platforms because the best solution doesn't always
                            live in one ecosystem, and I hold my Azure
                            Fundamentals certification with more on the way
                          </p>

                          <div className="mt-6 p-5 bg-background rounded-md border border-border">
                            <h4 className="text-primary mb-4 font-medium flex items-center gap-2">
                              <Coffee className="text-primary" size={18} />
                              Interests
                            </h4>
                            <ul className="space-y-2">
                              <li className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-chart-1 mr-3"></div>
                                Multi-Cloud Architecture
                              </li>
                              <li className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-chart-2 mr-3"></div>
                                Infrastructure Automation
                              </li>
                              <li className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-chart-3 mr-3"></div>
                                Cloud Security
                              </li>
                              <li className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-chart-4 mr-3"></div>
                                Open Source & DevOps
                              </li>
                              <li className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-chart-5 mr-3"></div>
                                AI & Machine Learning
                              </li>
                            </ul>
                          </div>

                          <Alert className="mt-6 bg-primary/10 border-primary">
                            <AlertCircle className="h-4 w-4 text-primary" />
                            <AlertTitle className="text-primary">
                              Current Status
                            </AlertTitle>
                            <AlertDescription className="text-card-foreground">
                              Open to new opportunities and exciting projects.
                              Looking to work with cutting-edge technologies in
                              a collaborative environment.
                            </AlertDescription>
                          </Alert>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="experience">
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="space-y-6">
                      <motion.div variants={itemVariants}>
                        <Card className="bg-card border-border hover:shadow-lg transition-shadow duration-300">
                          <CardHeader className="border-b border-border">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle>Cloud Engineer</CardTitle>
                                <CardDescription>
                                  SimpleTemp UK - Dental Staffing SaaS Platform
                                </CardDescription>
                              </div>
                              <Badge className="bg-primary text-primary-foreground">
                                Current
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-6">
                            <div className="flex items-center text-sm text-muted-foreground mb-4">
                              <Calendar
                                size={16}
                                className="mr-2 text-primary"
                              />
                              May 2024 - Present | London, UK
                            </div>
                            <ul className="space-y-3 text-card-foreground">
                              <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  Architected AWS and DigitalOcean cloud
                                  infrastructure (Lambda, API Gateway, RDS, S3,
                                  SES) supporting 1,000+ concurrent users with
                                  optimized cost structure for early-stage
                                  dental staffing platform
                                </div>
                              </li>
                              <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  Cut operational costs 70% by migrating from
                                  Mailchimp to AWS SES, implementing
                                  auto-scaling policies, and utilizing reserved
                                  instances during rapid growth phase
                                </div>
                              </li>
                              <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  Built scalable Node.js microservices
                                  architecture with RDS query optimization and
                                  caching strategies, enabling 10x user growth
                                  (100 to 1,000 concurrent users) without
                                  infrastructure re-architecture
                                </div>
                              </li>
                              <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  Automated deployment pipeline using Docker and
                                  GitHub Actions CI/CD, enabling multiple daily
                                  releases while eliminating manual deployment
                                  errors and operational overhead
                                </div>
                              </li>
                              <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  Secured platform with encryption controls, IAM
                                  access management, and audit logging to secure
                                  dental professional credentials and clinic
                                  data as user base scaled
                                </div>
                              </li>
                              <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  Maintained platform reliability using
                                  CloudWatch and X-Ray monitoring, identifying
                                  performance bottlenecks during rapid user
                                  growth
                                </div>
                              </li>
                            </ul>

                            <div className="mt-6 p-4 bg-background rounded-md">
                              <h4 className="text-primary text-sm font-medium mb-2">
                                Key Technologies
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">Multi-Cloud</Badge>

                                <Badge variant="secondary">Lambda</Badge>

                                <Badge variant="secondary">RDS</Badge>
                                <Badge variant="secondary">SES</Badge>
                                <Badge variant="secondary">IAM</Badge>
                                <Badge variant="secondary">CloudWatch</Badge>
                                <Badge variant="secondary">Docker</Badge>
                                <Badge variant="secondary">CloudWatch</Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <Card className="bg-card border-border hover:shadow-lg transition-shadow duration-300">
                          <CardHeader className="border-b border-border">
                            <CardTitle>
                              Cloud Infrastructure Engineer (Co-op)
                            </CardTitle>
                            <CardDescription>
                              Student Portal Infrastructure, Sheridan College
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-6">
                            <div className="flex items-center text-sm text-muted-foreground mb-4">
                              <Calendar
                                size={16}
                                className="mr-2 text-primary"
                              />
                              January 2024 - April 2024 | Oakville, ON
                            </div>
                            <ul className="space-y-3 text-card-foreground">
                              <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  Designed multi-tier Azure infrastructure with
                                  Terraform and VNet subnet segmentation,
                                  reducing deployment time from 8 hours to 12
                                  minutes and supporting 5,000+ concurrent
                                  users.
                                </div>
                              </li>
                              <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  Improved database performance with Azure Cache
                                  for Redis and query indexing, lowering API
                                  latency by 73% (450ms to 120ms) and DB CPU
                                  usage from 82% to 34%.
                                </div>
                              </li>
                              <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  Deployed disaster recovery across 3 Azure
                                  availability zones with automated failover and
                                  geo-redundant PostgreSQL replication,
                                  achieving 99.95% uptime and sub-second
                                  recovery.
                                </div>
                              </li>
                              <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  Strengthened security using NSGs, Key Vault,
                                  Azure AD, and TLS encryption to protect
                                  student data and support FERPA compliance.
                                </div>
                              </li>
                              <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  Reduced monthly infrastructure costs by 38%
                                  (~$700) through App Service SKU right-sizing,
                                  autoscaling optimization, and storage tiering
                                  while maintaining performance targets.
                                </div>
                              </li>
                              <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  Configured monitoring with Application
                                  Insights and Azure Monitor using 15+ automated
                                  alerts, reducing mean time to detection from
                                  45 minutes to 3 minutes.
                                </div>
                              </li>
                            </ul>

                            <div className="mt-6 p-4 bg-background rounded-md">
                              <h4 className="text-primary text-sm font-medium mb-2">
                                Key Technologies
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">Azure</Badge>
                                <Badge variant="secondary">Terraform</Badge>
                                <Badge variant="secondary">Redis</Badge>
                                <Badge variant="secondary">PostgreSQL</Badge>
                                <Badge variant="secondary">Azure AD</Badge>
                                <Badge variant="secondary">Key Vault</Badge>
                                <Badge variant="secondary">
                                  Application Insights
                                </Badge>
                                <Badge variant="secondary">Azure Monitor</Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <Card className="bg-card border-border hover:shadow-lg transition-shadow duration-300">
                          <CardHeader className="border-b border-border">
                            <CardTitle>Cloud Developer (Co-op)</CardTitle>
                            <CardDescription>
                              Mobile Insurance Platform, Sun Life Financial
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-6">
                            <div className="flex items-center text-sm text-muted-foreground mb-4">
                              <Calendar
                                size={16}
                                className="mr-2 text-primary"
                              />
                              September 2022 - December 2022 | Toronto, ON
                            </div>
                            <ul className="space-y-3 text-card-foreground">
                              <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  Developed investment portfolio microservices
                                  using AWS Lambda and API Gateway to expose
                                  customer investment data and transaction
                                  history for 50,000+ insurance customers.
                                </div>
                              </li>
                              <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  Integrated third-party investment data with
                                  Lambda functions and ElastiCache request
                                  caching, delivering unified REST APIs for
                                  frontend consumption.
                                </div>
                              </li>
                              <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  Improved API performance through caching, RDS
                                  query optimization, and SQS asynchronous
                                  processing, cutting response time from 800ms
                                  to 200ms and eliminating peak-hour timeouts.
                                </div>
                              </li>
                              <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  Automated Lambda deployments with AWS
                                  CloudFormation templates, enabling
                                  version-controlled infrastructure updates
                                  across development and production.
                                </div>
                              </li>
                            </ul>

                            <div className="mt-6 p-4 bg-background rounded-md">
                              <h4 className="text-primary text-sm font-medium mb-2">
                                Key Technologies
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">AWS Lambda</Badge>
                                <Badge variant="secondary">API Gateway</Badge>
                                <Badge variant="secondary">ElastiCache</Badge>
                                <Badge variant="secondary">REST APIs</Badge>
                                <Badge variant="secondary">Amazon RDS</Badge>
                                <Badge variant="secondary">Amazon SQS</Badge>
                                <Badge variant="secondary">
                                  CloudFormation
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <Card className="bg-card border-border hover:shadow-lg transition-shadow duration-300">
                          <CardHeader className="border-b border-border">
                            <CardTitle>
                              Junior Backend/DevOps Engineer (Co-op)
                            </CardTitle>
                            <CardDescription>
                              Ghostwriting Marketplace Platform, The Urban
                              Writers
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-6">
                            <div className="flex items-center text-sm text-muted-foreground mb-4">
                              <Calendar
                                size={16}
                                className="mr-2 text-primary"
                              />
                              January 2022 - May 2022 | Oakville, ON
                            </div>
                            <ul className="space-y-3 text-card-foreground">
                              <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  Containerized a Ruby on Rails application with
                                  Docker, creating development and production
                                  workflows that reduced deployment-related bugs
                                  by 45% and improved onboarding efficiency.
                                </div>
                              </li>
                              <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  Contributed to CI/CD with GitHub Actions to
                                  test, build Docker images, and deploy to AWS
                                  Elastic Beanstalk, reducing release time from
                                  2 hours to 15 minutes.
                                </div>
                              </li>
                              <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  Optimized performance with Redis caching and
                                  Sidekiq async job processing, reducing API
                                  response time by 50% during peak marketplace
                                  activity.
                                </div>
                              </li>
                            </ul>

                            <div className="mt-6 p-4 bg-background rounded-md">
                              <h4 className="text-primary text-sm font-medium mb-2">
                                Key Technologies
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">Ruby on Rails</Badge>
                                <Badge variant="secondary">Docker</Badge>
                                <Badge variant="secondary">
                                  GitHub Actions
                                </Badge>
                                <Badge variant="secondary">
                                  AWS Elastic Beanstalk
                                </Badge>
                                <Badge variant="secondary">Redis</Badge>
                                <Badge variant="secondary">Sidekiq</Badge>
                                <Badge variant="secondary">CI/CD</Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="skills">
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  >
                    <motion.div variants={itemVariants}>
                      <Card className="bg-card border-border hover:shadow-lg transition-shadow duration-300 h-full">
                        <CardHeader className="border-b border-border">
                          <CardTitle className="flex items-center gap-2">
                            <Code className="text-primary" size={20} />
                            Technical Skills
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="space-y-6">
                            {mainSkills.map((skill, index) => (
                              <SkillItem
                                key={index}
                                name={skill.name}
                                level={skill.level}
                                icon={skill.icon}
                              />
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      className="flex flex-col gap-6"
                    >
                      <Card className="bg-card border-border hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="border-b border-border">
                          <CardTitle className="flex items-center gap-2">
                            <Server className="text-primary" size={20} />
                            Technologies
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">AWS</Badge>
                            <Badge variant="secondary">Azure</Badge>
                            <Badge variant="secondary">Terraform</Badge>
                            <Badge variant="secondary">CloudFormation</Badge>
                            <Badge variant="secondary">Docker</Badge>
                            <Badge variant="secondary">Kubernetes</Badge>
                            <Badge variant="secondary">GitHub Actions</Badge>
                            <Badge variant="secondary">Jenkins</Badge>
                            <Badge variant="secondary">Python</Badge>
                            <Badge variant="secondary">Bash</Badge>
                            <Badge variant="secondary">PowerShell</Badge>
                            <Badge variant="secondary">IAM</Badge>
                            <Badge variant="secondary">Zero Trust</Badge>
                            <Badge variant="secondary">Azure AD</Badge>
                            <Badge variant="secondary">Key Vault</Badge>
                            <Badge variant="secondary">CloudWatch</Badge>
                            <Badge variant="secondary">Azure Monitor</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="projects">
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {projects.map((project, index) => (
                        <motion.div
                          key={index}
                          variants={itemVariants}
                          className="h-full"
                        >
                          <Card className="bg-card border-border hover:shadow-lg transition-shadow duration-300 h-full">
                            <CardHeader className="border-b border-border">
                              <CardTitle>{project.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                              <p className="text-card-foreground">
                                {project.description}
                              </p>
                              <div className="mt-4 flex flex-wrap gap-2">
                                {project.tags.map((tag, i) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="text-primary border-primary"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                            <CardFooter className="flex justify-between border-t border-border pt-4">
                              <span className="text-sm text-muted-foreground">
                                {project.projectType}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedProject(project)}
                              >
                                Details
                              </Button>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="education">
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <div className="space-y-6">
                      <motion.div variants={itemVariants}>
                        <Card className="bg-card border-border hover:shadow-lg transition-shadow duration-300">
                          <CardHeader className="border-b border-border">
                            <CardTitle>
                              Software Development Network Engineering (Co-op)
                            </CardTitle>
                            <CardDescription>Sheridan College</CardDescription>
                          </CardHeader>
                          <CardContent className="pt-6">
                            <div className="flex items-center text-sm text-muted-foreground mb-4">
                              <Calendar
                                size={16}
                                className="mr-2 text-primary"
                              />
                              September 2020 - August 2024
                            </div>
                            <div className="space-y-4">
                              <div className="flex items-center gap-4">
                                <div className="bg-primary/10 p-2 rounded-md">
                                  <Award className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">
                                    Computer Systems Technology
                                  </p>
                                  <p className="text-muted-foreground">
                                    GPA: 3.9/4.0
                                  </p>
                                </div>
                              </div>

                              <div className="mt-6 p-5 bg-background rounded-md border border-border">
                                <h4 className="text-primary mb-4 font-medium">
                                  Key Coursework
                                </h4>
                                <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                                  <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-chart-1 mr-3"></div>
                                    <span>Cloud Enabled Networks</span>
                                  </div>
                                  <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-chart-2 mr-3"></div>
                                    <span>Computer and Network Security</span>
                                  </div>
                                  <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-chart-3 mr-3"></div>
                                    <span>
                                      Systems Development Methodologies
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-chart-4 mr-3"></div>
                                    <span>
                                      Data Communications and Networking
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-chart-2 mr-3"></div>
                                    <span>IT Project Management using PMP</span>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-6">
                                <h4 className="text-primary mb-3 font-medium">
                                  Academic Achievements
                                </h4>
                                <ul className="space-y-2">
                                  <li className="flex items-start">
                                    <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                    <div>
                                      Dean's List recognition for academic
                                      excellence (2020-2023)
                                    </div>
                                  </li>
                                  <li className="flex items-start">
                                    <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                    <div>
                                      Selected for competitive internship
                                      program based on academic performance
                                    </div>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                  </motion.div>
                </TabsContent>
              </div>
            </AnimatePresence>
          </Tabs>
        </main>

        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-4xl rounded-xl border border-border bg-card shadow-2xl">
              <div className="flex items-start justify-between border-b border-border p-5">
                <h3 className="text-xl md:text-2xl font-semibold">
                  {selectedProject.title}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedProject(null)}
                >
                  Close
                </Button>
              </div>

              <div className="space-y-6 p-5 max-h-[75vh] overflow-y-auto">
                <section>
                  <h4 className="text-primary font-medium mb-2">Overview</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedProject.overview}
                  </p>
                </section>

                <section>
                  <h4 className="text-primary font-medium mb-2">
                    Problem Solved
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedProject.problemSolved}
                  </p>
                </section>

                <section>
                  <h4 className="text-primary font-medium mb-3">
                    How It Works
                  </h4>
                  {selectedProject.architectureImage ? (
                    <img
                      src={selectedProject.architectureImage}
                      alt={`${selectedProject.title} architecture diagram`}
                      className="w-full rounded-lg border border-border object-cover"
                    />
                  ) : (
                    <div className="rounded-lg border border-border bg-background p-4 overflow-x-auto">
                      <svg
                        width={
                          selectedProject.flowSteps.length * flowBoxWidth +
                          (selectedProject.flowSteps.length - 1) * flowGap
                        }
                        height={flowBoxHeight + 24}
                        role="img"
                        aria-label={`${selectedProject.title} flow diagram`}
                      >
                        {selectedProject.flowSteps.map((step, index) => {
                          const x = index * (flowBoxWidth + flowGap);
                          const y = 12;
                          const nextX = x + flowBoxWidth;
                          const arrowEndX = x + flowBoxWidth + flowGap - 10;

                          return (
                            <g key={step}>
                              <rect
                                x={x}
                                y={y}
                                width={flowBoxWidth}
                                height={flowBoxHeight}
                                rx={8}
                                ry={8}
                                fill="hsl(var(--card))"
                                stroke="hsl(var(--primary))"
                                strokeOpacity="0.6"
                              />
                              <text
                                x={x + flowBoxWidth / 2}
                                y={y + flowBoxHeight / 2 + 5}
                                textAnchor="middle"
                                fontSize="12"
                                fontFamily="system-ui, sans-serif"
                                fill="hsl(var(--foreground))"
                              >
                                {step}
                              </text>

                              {index < selectedProject.flowSteps.length - 1 && (
                                <>
                                  <line
                                    x1={nextX + 6}
                                    y1={y + flowBoxHeight / 2}
                                    x2={arrowEndX}
                                    y2={y + flowBoxHeight / 2}
                                    stroke="hsl(var(--primary))"
                                    strokeWidth="2"
                                  />
                                  <polygon
                                    points={`${arrowEndX},${y + flowBoxHeight / 2} ${arrowEndX - 8},${y + flowBoxHeight / 2 - 5} ${arrowEndX - 8},${y + flowBoxHeight / 2 + 5}`}
                                    fill="hsl(var(--primary))"
                                  />
                                </>
                              )}
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  )}
                </section>

                <section>
                  <h4 className="text-primary font-medium mb-2">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.techStack.map((tech) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="max-w-6xl mx-auto mt-8 border-t border-border pt-6 pb-16 px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-muted-foreground text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Soheila Kamali. All rights reserved.
            </div>
            <div className="flex gap-4">
              <a
                href="mailto:soheila.k@hotmail.ca"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/soheila-kamali"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://github.com/waseemam"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github size={18} />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Resume;
