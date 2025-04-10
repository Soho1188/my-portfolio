import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ModeToggle } from "@/components/theme-provider";
import {
  AlertCircle,
  Calendar,
  Code,
  Database,
  ExternalLink,
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
    "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ亜愛夢神零光闇電幻彗龍☆★◇◆●◎△▽∵∴※〒Σ∞≡≪≫ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  const columns = Array.from({ length: 40 }, (_, i) => i);

  return (
    <div className="fixed inset-0 z-0 opacity-10 overflow-hidden">
      {columns.map((col) => {
        const randomChars = Array.from(
          { length: Math.floor(Math.random() * 30) + 5 },
          () => characters[Math.floor(Math.random() * characters.length)]
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
    []
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
            5 + (currentCommand * 15 + (charIndex / fullCommand.length) * 90)
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
  link?: string;
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
    { name: "JavaScript/TypeScript", level: 90, icon: <Braces size={16} /> },
    { name: "React/Angular", level: 85, icon: <LayoutGrid size={16} /> },
    { name: "Node.js/Express", level: 80, icon: <Server size={16} /> },
    { name: "Git & Version Control", level: 95, icon: <GitBranch size={16} /> },
    { name: "Database Design", level: 85, icon: <Database size={16} /> },
    { name: "RESTful APIs", level: 90, icon: <Globe size={16} /> },
  ];

  const technologies: string[] = [
    "React",
    "Angular",
    "Node.js",
    "Express",
    "MongoDB",
    "SQL",
    "TypeScript",
    "Redux",
    "HTML5",
    "CSS3",
    "Git",
    "Docker",
    "AWS",
    "Firebase",
    "REST APIs",
    "GraphQL",
    "TailwindCSS",
  ];

  const projects: Project[] = [
    {
      title: "E-Commerce Platform",
      description:
        "Built a full-stack e-commerce solution with React, Node.js, and MongoDB. Implemented user authentication, product catalog, and payment processing.",
      tags: ["React", "Node.js", "MongoDB", "Stripe"],
    },
    {
      title: "CMS Dashboard",
      description:
        "Developed an admin dashboard for content management with role-based access control and real-time updates.",
      tags: ["Angular", "Firebase", "TypeScript"],
    },
    {
      title: "API Gateway",
      description:
        "Designed and implemented a microservices API gateway to handle authentication, rate limiting, and request routing.",
      tags: ["Express", "Docker", "Redis"],
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
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-chart-1 to-chart-3 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  SW
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
                  Syed Ammar Waseem
                </motion.h1>
                <h2 className="text-xl md:text-2xl mt-2 text-muted-foreground flex items-center justify-center md:justify-start">
                  <Terminal className="mr-2 text-primary" size={20} />
                  <TypedText text="Full Stack Engineer" />
                </h2>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                  <Badge
                    variant="outline"
                    className="border-chart-5 text-chart-5 hover-glow"
                  >
                    JavaScript
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-chart-5 text-chart-5 hover-glow"
                  >
                    React
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-chart-5 text-chart-5 hover-glow"
                  >
                    Node.js
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-chart-5 text-chart-5 hover-glow"
                  >
                    MongoDB
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-chart-5 text-chart-5 hover-glow"
                  >
                    AWS
                  </Badge>
                </div>
              </div>
            </div>
            <div className="mt-8 md:mt-0 flex gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href="mailto:ammarwaseem84@outlook.com"
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-card hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Mail size={18} />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>ammarwaseem84@outlook.com</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href="tel:4372459451"
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-card hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Phone size={18} />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>437-245-9451</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href="https://www.linkedin.com/in/ammarwaseem"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-card hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Linkedin size={18} />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>linkedin.com/in/ammarwaseem</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href="https://github.com"
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
                    <p>Milton, Ontario, Canada</p>
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
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
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
                            I am a passionate full-stack developer with
                            expertise in modern web technologies. My journey in
                            software development began at Sheridan College,
                            where I maintained a 3.9 GPA while working on
                            various projects that expanded my technical
                            knowledge.
                          </p>
                          <p className="mt-4 text-card-foreground leading-relaxed">
                            My experience at ERCO Worldwide has given me
                            practical insights into enterprise-level software
                            development, where I've contributed to building
                            robust applications and optimizing existing systems.
                            I enjoy solving complex problems with clean,
                            efficient code and staying updated with the latest
                            industry trends.
                          </p>
                          <p className="mt-4 text-card-foreground leading-relaxed">
                            In addition to my technical skills, I pride myself
                            on my communication abilities and organizational
                            approach to projects. I believe good software is
                            born from collaboration and clear understanding of
                            requirements.
                          </p>

                          <div className="mt-6 p-5 bg-background rounded-md border border-border">
                            <h4 className="text-primary mb-4 font-medium flex items-center gap-2">
                              <Coffee className="text-primary" size={18} />
                              Interests
                            </h4>
                            <ul className="space-y-2">
                              <li className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-chart-1 mr-3"></div>
                                Open Source Contribution
                              </li>
                              <li className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-chart-2 mr-3"></div>
                                Systems Architecture
                              </li>
                              <li className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-chart-3 mr-3"></div>
                                Web Performance Optimization
                              </li>
                              <li className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-chart-4 mr-3"></div>
                                UI/UX Design
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
                                <CardTitle>Full Stack Engineer</CardTitle>
                                <CardDescription>
                                  ERCO Worldwide
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
                              July 2023 - Present
                            </div>
                            <ul className="space-y-3 text-card-foreground">
                              <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  Developed and maintained full-stack web
                                  applications using React, Node.js, and
                                  MongoDB, improving operational efficiency by
                                  40%.
                                </div>
                              </li>
                              <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  Implemented responsive designs and optimized
                                  frontend performance, reducing load times by
                                  30%.
                                </div>
                              </li>
                              <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  Designed and developed RESTful APIs with
                                  Node.js/Express, handling over 1000 requests
                                  per minute.
                                </div>
                              </li>
                              <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  Collaborated with cross-functional teams to
                                  implement new features and participated in
                                  code reviews.
                                </div>
                              </li>
                              <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  Implemented CI/CD pipelines using GitHub
                                  Actions, reducing deployment time by 50%.
                                </div>
                              </li>
                            </ul>

                            <div className="mt-6 p-4 bg-background rounded-md">
                              <h4 className="text-primary text-sm font-medium mb-2">
                                Key Technologies
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">React</Badge>
                                <Badge variant="secondary">Node.js</Badge>
                                <Badge variant="secondary">Express</Badge>
                                <Badge variant="secondary">MongoDB</Badge>
                                <Badge variant="secondary">TypeScript</Badge>
                                <Badge variant="secondary">Docker</Badge>
                                <Badge variant="secondary">AWS</Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <Card className="bg-card border-border hover:shadow-lg transition-shadow duration-300">
                          <CardHeader className="border-b border-border">
                            <CardTitle>Web Developer</CardTitle>
                            <CardDescription>ERCO Worldwide</CardDescription>
                          </CardHeader>
                          <CardContent className="pt-6">
                            <div className="flex items-center text-sm text-muted-foreground mb-4">
                              <Calendar
                                size={16}
                                className="mr-2 text-primary"
                              />
                              August 2022 - December 2022
                            </div>
                            <ul className="space-y-3 text-card-foreground">
                              <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  Co-op web developer position focused on
                                  frontend development with Angular and
                                  TypeScript.
                                </div>
                              </li>
                              <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  Implemented responsive UI components and
                                  integrated with backend services.
                                </div>
                              </li>
                              <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  Participated in Agile development processes
                                  and sprint planning.
                                </div>
                              </li>
                            </ul>

                            <div className="mt-6 p-4 bg-background rounded-md">
                              <h4 className="text-primary text-sm font-medium mb-2">
                                Key Technologies
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">Angular</Badge>
                                <Badge variant="secondary">TypeScript</Badge>
                                <Badge variant="secondary">SCSS</Badge>
                                <Badge variant="secondary">REST APIs</Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <Card className="bg-card border-border hover:shadow-lg transition-shadow duration-300">
                          <CardHeader className="border-b border-border">
                            <CardTitle>Freelance Developer</CardTitle>
                            <CardDescription>ammarwaseem.com</CardDescription>
                          </CardHeader>
                          <CardContent className="pt-6">
                            <div className="flex items-center text-sm text-muted-foreground mb-4">
                              <Calendar
                                size={16}
                                className="mr-2 text-primary"
                              />
                              April 2022 - August 2022
                            </div>
                            <ul className="space-y-3 text-card-foreground">
                              <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  Developed custom websites and web applications
                                  for small businesses and startups.
                                </div>
                              </li>
                              <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  Created responsive, mobile-friendly interfaces
                                  with modern JavaScript frameworks.
                                </div>
                              </li>
                              <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  Managed client relationships and delivered
                                  projects on tight deadlines.
                                </div>
                              </li>
                            </ul>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <Card className="bg-card border-border hover:shadow-lg transition-shadow duration-300">
                          <CardHeader className="border-b border-border">
                            <CardTitle>Lead Tutor</CardTitle>
                            <CardDescription>Sheridan College</CardDescription>
                          </CardHeader>
                          <CardContent className="pt-6">
                            <div className="flex items-center text-sm text-muted-foreground mb-4">
                              <Calendar
                                size={16}
                                className="mr-2 text-primary"
                              />
                              January 2022 - April 2022
                            </div>
                            <ul className="space-y-3 text-card-foreground">
                              <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  Provided guidance and support to students in
                                  programming courses.
                                </div>
                              </li>
                              <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  Led weekly programming workshops and
                                  one-on-one tutoring sessions.
                                </div>
                              </li>
                              <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                <div>
                                  Developed supplementary learning materials to
                                  help students grasp complex concepts.
                                </div>
                              </li>
                            </ul>
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
                            {technologies.map((tech, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="hover:bg-primary/10 transition-colors cursor-default"
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-card border-border hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="border-b border-border">
                          <CardTitle className="flex items-center gap-2">
                            <Database className="text-primary" size={20} />
                            Databases & Cloud
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center">
                            <div className="flex flex-col items-center">
                              <div className="w-16 h-16 rounded-full bg-chart-1/20 flex items-center justify-center mb-3 hover-glow">
                                <span className="text-chart-1 text-xl font-bold">
                                  SQL
                                </span>
                              </div>
                              <span className="text-sm">SQL</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <div className="w-16 h-16 rounded-full bg-chart-2/20 flex items-center justify-center mb-3 hover-glow">
                                <span className="text-chart-2 text-xl font-bold">
                                  M
                                </span>
                              </div>
                              <span className="text-sm">MongoDB</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <div className="w-16 h-16 rounded-full bg-chart-3/20 flex items-center justify-center mb-3 hover-glow">
                                <span className="text-chart-3 text-xl font-bold">
                                  AWS
                                </span>
                              </div>
                              <span className="text-sm">AWS</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <div className="w-16 h-16 rounded-full bg-chart-4/20 flex items-center justify-center mb-3 hover-glow">
                                <span className="text-chart-4 text-xl font-bold">
                                  FB
                                </span>
                              </div>
                              <span className="text-sm">Firebase</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <div className="w-16 h-16 rounded-full bg-chart-5/20 flex items-center justify-center mb-3 hover-glow">
                                <span className="text-chart-5 text-xl font-bold">
                                  R
                                </span>
                              </div>
                              <span className="text-sm">Redis</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-3 hover-glow">
                                <span className="text-primary text-xl font-bold">
                                  GH
                                </span>
                              </div>
                              <span className="text-sm">GitHub</span>
                            </div>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                              {project.link ? (
                                <a
                                  href={project.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center text-primary hover:underline"
                                >
                                  View Project{" "}
                                  <ExternalLink size={14} className="ml-1" />
                                </a>
                              ) : (
                                <span className="text-sm text-muted-foreground">
                                  Private Project
                                </span>
                              )}
                              <Button variant="outline" size="sm">
                                Details
                              </Button>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ))}

                      <motion.div variants={itemVariants} className="h-full">
                        <Card className="bg-card border-border hover:shadow-lg transition-shadow duration-300 h-full border-dashed border-2 flex flex-col items-center justify-center p-6">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <Plus size={24} className="text-primary" />
                          </div>
                          <h3 className="text-xl font-medium mb-2">
                            More Projects
                          </h3>
                          <p className="text-center text-muted-foreground mb-4">
                            Check out my GitHub for additional projects and
                            contributions
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-auto glow-pulse"
                          >
                            View GitHub
                          </Button>
                        </Card>
                      </motion.div>
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
                              Software Development Network Engineering
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
                                    Computer/Information Technology
                                    Administration and Management
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
                                    <span>Data Structures & Algorithms</span>
                                  </div>
                                  <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-chart-2 mr-3"></div>
                                    <span>Web Development</span>
                                  </div>
                                  <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-chart-3 mr-3"></div>
                                    <span>Database Systems</span>
                                  </div>
                                  <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-chart-4 mr-3"></div>
                                    <span>Network Security</span>
                                  </div>
                                  <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-chart-5 mr-3"></div>
                                    <span>Software Engineering</span>
                                  </div>
                                  <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-primary mr-3"></div>
                                    <span>Cloud Computing</span>
                                  </div>
                                  <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-chart-1 mr-3"></div>
                                    <span>Mobile Development</span>
                                  </div>
                                  <div className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-chart-2 mr-3"></div>
                                    <span>System Architecture</span>
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
                                      1st place in college Hackathon for
                                      developing an innovative IoT solution
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

                      <motion.div variants={itemVariants}>
                        <Card className="bg-card border-border hover:shadow-lg transition-shadow duration-300">
                          <CardHeader className="border-b border-border">
                            <CardTitle>High School Diploma</CardTitle>
                            <CardDescription>
                              Milton Senior High School
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pt-6">
                            <div className="flex items-center text-sm text-muted-foreground mb-4">
                              <Calendar
                                size={16}
                                className="mr-2 text-primary"
                              />
                              2019 - 2020
                            </div>
                            <p className="text-card-foreground">
                              Computer Science
                            </p>

                            <div className="mt-4">
                              <ul className="space-y-2">
                                <li className="flex items-start">
                                  <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                  <div>
                                    Graduated with honors in Computer Science
                                    track
                                  </div>
                                </li>
                                <li className="flex items-start">
                                  <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3 flex-shrink-0"></div>
                                  <div>
                                    Led the school's programming club and
                                    organized coding workshops
                                  </div>
                                </li>
                              </ul>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                  </motion.div>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </main>

        {/* Footer */}
        <footer className="max-w-6xl mx-auto mt-8 border-t border-border pt-6 pb-16 px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-muted-foreground text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Syed Ammar Waseem. All rights
              reserved.
            </div>
            <div className="flex gap-4">
              <a
                href="mailto:ammarwaseem84@outlook.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/ammarwaseem"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://github.com"
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

// Plus component for the Projects tab
const Plus = ({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
};

export default Resume;
