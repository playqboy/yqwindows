import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css, createGlobalStyle } from 'styled-components';
import AsciiDitherBackground from './AsciiDitherBackground';
import TargetCursor from './TargetCursor';
import TextPressure from './TextPressure';
import ASCIIText from './ASCIIText';

/* ── Constants ── */

const TYPE_SPEED = 60;
const DELETE_SPEED = 35;
const ASCII_HOLD = 2000;
const ASCII_FADE_OUT = 800;

/* ── Global ── */

const OverrideGlobal = createGlobalStyle`
  body { overflow: auto !important; }
`;

/* ── Animations ── */

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const blinkAnim = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

/* ── Layout ── */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #fafafa;
  overflow-y: auto;
  animation: ${fadeIn} 0.4s ease-out;
`;

/* ── Intro screen ── */

const IntroScreen = styled.div<{ $fading?: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 10001;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${(p) =>
    p.$fading &&
    css`animation: ${fadeOut} 0.6s ease-out forwards;`}
`;

const AsciiFadeWrapper = styled.div<{ $fading?: boolean }>`
  position: absolute;
  inset: 0;
  z-index: 0;
  transition: opacity ${ASCII_FADE_OUT}ms ease-out;
  opacity: ${(p) => (p.$fading ? 0 : 1)};
`;

const IntroTypedText = styled.div`
  font-family: 'Courier New', monospace;
  font-size: 28px;
  font-weight: 400;
  color: #111;
  min-height: 42px;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const IntroCursor = styled.span`
  animation: ${blinkAnim} 1s step-end infinite;
  color: #111;
`;

/* ── Portfolio content ── */

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 80px 40px 120px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  color: #111;
  position: relative;
  z-index: 1;
`;

const Hero = styled.div`
  margin-bottom: 80px;
  animation: ${slideUp} 0.7s ease-out both;
`;

const HeroTagline = styled.p`
  font-size: 20px;
  line-height: 1.7;
  color: #555;
  margin: 0 0 24px 0;
  max-width: 560px;
  font-weight: 300;

  @media (max-width: 600px) {
    font-size: 17px;
  }
`;

const HeroLinks = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const HeroLink = styled.a`
  font-size: 14px;
  color: #666;
  text-decoration: none;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.5px;
  padding-bottom: 2px;
  border-bottom: 1px solid transparent;
  transition: all 0.2s;
  &:hover {
    color: #111;
    border-bottom-color: #111;
  }
`;

const Section = styled.section<{ $delay?: number }>`
  margin-bottom: 72px;
  opacity: 0;
  animation: ${slideUp} 0.6s ease-out both;
  animation-delay: ${(p) => (p.$delay || 0)}ms;
`;

const SectionLabel = styled.h2`
  font-family: 'Courier New', monospace;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: #999;
  margin: 0 0 24px 0;
  font-weight: 400;
`;

const SectionText = styled.p`
  font-size: 17px;
  line-height: 1.9;
  color: #444;
  margin: 0;
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ProjectCard = styled.a<{ $tooltip?: string }>`
  display: block;
  position: relative;
  padding: 24px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
  background: #fff;

  &::after {
    content: '${(p) => p.$tooltip || ''}';
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%) translateY(4px);
    background: #111;
    color: #fff;
    font-size: 12px;
    font-family: 'Courier New', monospace;
    padding: 6px 12px;
    border-radius: 4px;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s, transform 0.2s;
  }

  &:hover {
    border-color: #ccc;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);

    &::after {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
`;

const ProjectRole = styled.span`
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 10px;
  font-family: 'Courier New', monospace;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #111;
  background: #fff;
  border: 1px solid #e8e8e8;
  padding: 2px 8px;
  border-radius: 4px;
`;

const ProjectName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 6px 0;
  color: #111;
`;

const ProjectDesc = styled.p`
  font-size: 14px;
  color: #777;
  margin: 0 0 12px 0;
  line-height: 1.5;
`;

const ProjectTech = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const TechTag = styled.span`
  font-size: 11px;
  font-family: 'Courier New', monospace;
  color: #999;
  background: #f5f5f5;
  padding: 2px 8px;
  border-radius: 3px;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const SkillCategory = styled.div``;

const SkillTitle = styled.h3`
  font-size: 14px;
  font-weight: 500;
  margin: 0 0 10px 0;
  color: #333;
`;

const SkillList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SkillItem = styled.li`
  font-size: 14px;
  color: #666;
  line-height: 2;
`;

const ContactSection = styled.div`
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
`;

const ContactLink = styled.a`
  font-size: 15px;
  color: #111;
  text-decoration: none;
  font-weight: 500;
  padding-bottom: 2px;
  border-bottom: 1.5px solid #ddd;
  transition: border-color 0.2s;
  &:hover {
    border-color: #111;
  }
`;

const BackButton = styled.button`
  position: fixed;
  top: 24px;
  left: 24px;
  background: rgba(250, 250, 250, 0.9);
  backdrop-filter: blur(8px);
  border: 1px solid #e0e0e0;
  padding: 8px 16px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  transition: all 0.2s;
  z-index: 10000;
  border-radius: 4px;
  &:hover {
    color: #111;
    border-color: #111;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #eee;
  margin: 0 0 72px 0;
`;

const Footer = styled.footer`
  font-size: 12px;
  color: #bbb;
  font-family: 'Courier New', monospace;
  text-align: center;
  padding-top: 40px;
  border-top: 1px solid #eee;
`;

const TxtLink = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-size: 14px;
  font-family: 'Courier New', monospace;
  color: #999;
  cursor: pointer;
  margin-top: 12px;
  display: inline-block;
  border-bottom: 1px dashed #ccc;
  transition: all 0.2s;
  &:hover {
    color: #111;
    border-bottom-color: #111;
  }
`;

const TxtModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10002;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.2s ease-out;
`;

const TxtModal = styled.div`
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  max-width: 480px;
  width: 90%;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.12);
  animation: ${slideUp} 0.3s ease-out;
`;

const TxtModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid #eee;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #999;
`;

const TxtModalClose = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  color: #bbb;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.2s;
  &:hover {
    color: #111;
  }
`;

const TxtModalBody = styled.div`
  padding: 24px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  white-space: pre-wrap;
`;

const TXT_CONTENT = `you can literally just do things

no mass. no friction. you don't need
permission or a mass following or an
mass audience. you just do the thing.

build. ship. write. draw. record. code.
make a site. make a game. make a tool
no one asked for but everyone needed.

the gap between "i want to" and "i did"
is mass smaller than you think.

so do the thing.

- yq`;

/* ── Typing engine ── */

interface TypeSequence {
  text: string;
  pauseAfter: number;
}

const INTRO_SEQUENCE: TypeSequence[] = [
  { text: 'welcome', pauseAfter: 1200 },
  { text: "this is yq's portfolio", pauseAfter: 1400 },
  { text: 'a work forever in progress', pauseAfter: 1400 },
  { text: 'you can literally just do things', pauseAfter: 1600 },
];

type IntroPhase = 'ascii' | 'fading-ascii' | 'typing' | 'done';

function useIntroTyping() {
  const [phase, setPhase] = useState<IntroPhase>('ascii');
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (phase === 'ascii') {
      timeoutRef.current = setTimeout(() => setPhase('fading-ascii'), ASCII_HOLD);
      return () => clearTimeout(timeoutRef.current);
    }
    if (phase === 'fading-ascii') {
      timeoutRef.current = setTimeout(() => setPhase('typing'), ASCII_FADE_OUT);
      return () => clearTimeout(timeoutRef.current);
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== 'typing') return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = setTimeout(resolve, ms);
      });

    const run = async () => {
      for (let i = 0; i < INTRO_SEQUENCE.length; i++) {
        if (cancelled) return;
        const { text, pauseAfter } = INTRO_SEQUENCE[i];

        for (let c = 1; c <= text.length; c++) {
          if (cancelled) return;
          setDisplayText(text.slice(0, c));
          await sleep(TYPE_SPEED);
        }

        await sleep(pauseAfter);
        if (cancelled) return;

        for (let c = text.length - 1; c >= 0; c--) {
          if (cancelled) return;
          setDisplayText(text.slice(0, c));
          await sleep(DELETE_SPEED);
        }

        await sleep(300);
      }

      if (!cancelled) {
        setShowCursor(false);
        setPhase('done');
      }
    };

    run();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [phase]);

  return { phase, displayText, showCursor };
}

/* ── Component ── */

interface PortfolioSiteProps {
  onClose: () => void;
}

const PortfolioSite: React.FC<PortfolioSiteProps> = ({ onClose }) => {
  const { phase: introPhase, displayText, showCursor } = useIntroTyping();
  const [introFading, setIntroFading] = useState(false);
  const [introGone, setIntroGone] = useState(false);
  const [showTxt, setShowTxt] = useState(false);
  const projectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (introPhase === 'done') {
      const t = setTimeout(() => setIntroFading(true), 400);
      return () => clearTimeout(t);
    }
  }, [introPhase]);

  useEffect(() => {
    if (introFading) {
      const t = setTimeout(() => setIntroGone(true), 600);
      return () => clearTimeout(t);
    }
  }, [introFading]);

  return (
    <Overlay>
      <OverrideGlobal />

      {/* Intro screen */}
      {!introGone && (
        <IntroScreen $fading={introFading}>
          {(introPhase === 'ascii' || introPhase === 'fading-ascii') && (
            <AsciiFadeWrapper $fading={introPhase === 'fading-ascii'}>
              <AsciiDitherBackground />
            </AsciiFadeWrapper>
          )}
          {(introPhase === 'typing' || introPhase === 'done') && (
            <IntroTypedText>
              {displayText}
              {showCursor && <IntroCursor>|</IntroCursor>}
            </IntroTypedText>
          )}
        </IntroScreen>
      )}

      {/* Portfolio */}
      {introGone && <TargetCursor targetSelector=".cursor-target" containerRef={projectsRef} />}
      <BackButton onClick={onClose}>&larr; back to desktop</BackButton>
      <Container>
        <Hero>
          <div style={{ width: '100%', height: '220px', marginBottom: '16px', overflow: 'hidden' }}>
            <TextPressure
              text="yoaquim"
              textColor="#111"
              weight={true}
              width={true}
              italic={false}
              alpha={false}
              flex={true}
              stroke={false}
              minFontSize={36}
            />
          </div>
          <HeroTagline>
            Building software that feels good to use.
            Full-stack developer focused on clean interfaces,
            solid architecture, and shipping things that matter.
          </HeroTagline>
          <HeroLinks>
            <HeroLink href="https://github.com/playqboy" target="_blank" rel="noopener noreferrer">github</HeroLink>
            <HeroLink href="https://x.com/yqboom" target="_blank" rel="noopener noreferrer">x</HeroLink>
            <HeroLink href="https://t.me/yoaquim" target="_blank" rel="noopener noreferrer">telegram</HeroLink>
          </HeroLinks>
        </Hero>

        <Divider />

        <Section $delay={100}>
          <SectionLabel>About</SectionLabel>
          <SectionText>
            you can literally just do things
          </SectionText>
          <TxtLink onClick={() => setShowTxt(true)}>
            youcanliterallyjustdothings.txt
          </TxtLink>
        </Section>

        <Section $delay={200}>
          <SectionLabel>Contributions</SectionLabel>
          <div ref={projectsRef}>
            <ProjectGrid>
              <ProjectCard className="cursor-target" href="https://x.com/quanto" target="_blank" rel="noopener noreferrer" $tooltip="down for reevaluation period">
                <ProjectRole>Core</ProjectRole>
                <ProjectName>Quanto</ProjectName>
                <ProjectDesc>Solana perpetuals exchange — trade with anything as margin, from BTC to memecoins and NFTs</ProjectDesc>
                <ProjectTech>
                  <TechTag>C++</TechTag>
                  <TechTag>Rust</TechTag>
                  <TechTag>Go</TechTag>
                  <TechTag>Ruby</TechTag>
                  <TechTag>TypeScript</TechTag>
                  <TechTag>JavaScript</TechTag>
                </ProjectTech>
              </ProjectCard>
              <ProjectCard className="cursor-target" href="https://boomish.org" target="_blank" rel="noopener noreferrer" $tooltip="core author">
                <ProjectRole>Core</ProjectRole>
                <ProjectName>Boomish</ProjectName>
                <ProjectDesc>Financial education and market analysis platform with 3,000+ subscribers — spotting trends before it's too late</ProjectDesc>
                <ProjectTech>
                  <TechTag>TypeScript</TechTag>
                </ProjectTech>
              </ProjectCard>
              <ProjectCard as="div" className="cursor-target" style={{ cursor: 'default', overflow: 'hidden', background: '#000', borderColor: '#333' }}>
                <div style={{ position: 'relative', width: '100%', height: '60px', marginBottom: '8px' }}>
                  <ASCIIText
                    text="temporarily redacted"
                    textFontSize={80}
                    asciiFontSize={5}
                    planeBaseHeight={5}
                    enableWaves={true}
                    textColor="#fdf9f3"
                  />
                </div>
                <ProjectDesc style={{ color: '#999' }}>a community for all likeminded individuals</ProjectDesc>
                <ProjectTech>
                  <TechTag style={{ background: '#1a1a1a', color: '#666' }}>none</TechTag>
                </ProjectTech>
              </ProjectCard>
            </ProjectGrid>
          </div>
        </Section>

        <Section $delay={300}>
          <SectionLabel>Skills</SectionLabel>
          <SkillsGrid>
            <SkillCategory>
              <SkillTitle>Languages</SkillTitle>
              <SkillList>
                <SkillItem>TypeScript</SkillItem>
                <SkillItem>Python</SkillItem>
                <SkillItem>Rust</SkillItem>
                <SkillItem>Go</SkillItem>
              </SkillList>
            </SkillCategory>
            <SkillCategory>
              <SkillTitle>Frontend</SkillTitle>
              <SkillList>
                <SkillItem>React / Next.js</SkillItem>
                <SkillItem>Vue / Nuxt</SkillItem>
                <SkillItem>Svelte</SkillItem>
                <SkillItem>CSS / Tailwind</SkillItem>
              </SkillList>
            </SkillCategory>
            <SkillCategory>
              <SkillTitle>Backend & Infra</SkillTitle>
              <SkillList>
                <SkillItem>Node.js</SkillItem>
                <SkillItem>Django / FastAPI</SkillItem>
                <SkillItem>Docker / K8s</SkillItem>
                <SkillItem>AWS / Vercel</SkillItem>
              </SkillList>
            </SkillCategory>
          </SkillsGrid>
        </Section>

        <Section $delay={400}>
          <SectionLabel>Contact</SectionLabel>
          <ContactSection>
            <ContactLink href="https://x.com/yqboom" target="_blank" rel="noopener noreferrer">X</ContactLink>
            <ContactLink href="https://t.me/yoaquim" target="_blank" rel="noopener noreferrer">Telegram</ContactLink>
          </ContactSection>
        </Section>

        <Footer>built with coffee and curiosity</Footer>
      </Container>

      {showTxt && (
        <TxtModalOverlay onClick={() => setShowTxt(false)}>
          <TxtModal onClick={(e) => e.stopPropagation()}>
            <TxtModalHeader>
              <span>youcanliterallyjustdothings.txt</span>
              <TxtModalClose onClick={() => setShowTxt(false)}>&times;</TxtModalClose>
            </TxtModalHeader>
            <TxtModalBody>{TXT_CONTENT}</TxtModalBody>
          </TxtModal>
        </TxtModalOverlay>
      )}
    </Overlay>
  );
};

export default PortfolioSite;
