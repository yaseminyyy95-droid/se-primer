/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header.tsx';
import { IntroScreen } from './components/IntroScreen.tsx';
import { DecisionScene } from './components/DecisionScene.tsx';
import { EndingScreen } from './components/EndingScreen.tsx';
import { TutorDrawer } from './components/TutorDrawer.tsx';
import { PostMortemModal } from './components/PostMortemModal.tsx';
import {
  LevelId,
  RoleId,
  GoalId,
  DECISIONS,
  calculateClock,
  LEVELS,
  ROLES,
} from './data/story.ts';
import { TutorContext } from './data/tutorPrompt.ts';

type AppState = 'GIRIS' | 'K1' | 'S1' | 'K2' | 'S2' | 'K3' | 'S3' | 'ENDING';

interface DecisionChoice {
  decisionId: number;
  chosen: 'A' | 'B';
  timedOut: boolean;
}

export default function App() {
  // User profile selections (defaults: unselected / null until chosen)
  const [level, setLevel] = useState<LevelId | null>(null);
  const [role, setRole] = useState<RoleId | null>(null);
  const [goal, setGoal] = useState<GoalId | null>(null);

  // State machine state
  const [currentState, setCurrentState] = useState<AppState>('GIRIS');

  // Decision choices storage
  const [choices, setChoices] = useState<Record<number, DecisionChoice>>({});

  // Tutor drawer state
  const [isTutorOpen, setIsTutorOpen] = useState(false);

  // Post-Mortem modal state
  const [isPostMortemOpen, setIsPostMortemOpen] = useState(false);

  // Calculate accumulated minutes based on current state
  const getAccumulatedMinutes = (): number => {
    let minutes = 0;
    if (currentState === 'GIRIS' || currentState === 'K1') {
      return 0;
    }

    if (choices[1]?.chosen) {
      minutes += DECISIONS[1].options[choices[1].chosen].durationMinutes;
    }

    if (currentState === 'K2') return minutes;

    if (choices[2]?.chosen) {
      minutes += DECISIONS[2].options[choices[2].chosen].durationMinutes;
    }

    if (currentState === 'K3') return minutes;

    if (choices[3]?.chosen) {
      minutes += DECISIONS[3].options[choices[3].chosen].durationMinutes;
    }

    return minutes;
  };

  const currentClockTime = calculateClock(getAccumulatedMinutes());

  // Determine current active decision ID (1, 2, or 3)
  const currentDecisionId: number =
    currentState === 'K1' || currentState === 'S1'
      ? 1
      : currentState === 'K2' || currentState === 'S2'
      ? 2
      : currentState === 'K3' || currentState === 'S3'
      ? 3
      : 1;

  // Handle option selection
  const handleSelectOption = (option: 'A' | 'B', isTimeout = false) => {
    const decisionId = currentDecisionId;
    setChoices((prev) => ({
      ...prev,
      [decisionId]: {
        decisionId,
        chosen: option,
        timedOut: isTimeout,
      },
    }));

    // Transition from K to S
    if (currentState === 'K1') setCurrentState('S1');
    else if (currentState === 'K2') setCurrentState('S2');
    else if (currentState === 'K3') setCurrentState('S3');
  };

  // Handle continue button from outcome card
  const handleContinue = () => {
    if (currentState === 'S1') {
      setCurrentState('K2');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentState === 'S2') {
      setCurrentState('K3');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentState === 'S3') {
      setCurrentState('ENDING');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Restart flow
  const handleRestart = () => {
    setChoices({});
    setLevel(null);
    setRole(null);
    setGoal(null);
    setCurrentState('GIRIS');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Current decision data
  const currentDecision = DECISIONS[currentDecisionId];

  // Tutor context
  const decisionText = `${currentDecision.incidentHeading} — ${currentDecision.title}. Seçenek A: ${currentDecision.options.A.title} (${currentDecision.options.A.subtitle}). Seçenek B: ${currentDecision.options.B.title} (${currentDecision.options.B.subtitle}).`;
  const tutorContext: TutorContext = {
    decisionId: currentDecision.id,
    decisionText,
    teachingTarget: currentDecision.tutorTeachingTarget,
    userLevel: (level !== null ? LEVELS.find((l) => l.id === level)?.title : undefined) || 'Biraz deneyimim var',
  };

  const isSceneState = ['K1', 'S1', 'K2', 'S2', 'K3', 'S3'].includes(currentState);

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex justify-center font-sans">
      {/* 390px mobile container */}
      <div className="w-full max-w-[390px] sm:max-w-[420px] min-h-screen flex flex-col bg-[#070B14] shadow-2xl relative border-x border-slate-800/50 overflow-x-hidden">
        {/* Header - Back button is hidden during K1-S3 so player cannot rewind decisions */}
        <Header
          showBack={false}
          title={
            currentState === 'GIRIS'
              ? 'SE Primer: Kitap Girişi'
              : currentState === 'ENDING'
              ? 'Post-Mortem Detayı'
              : 'Canlı Kriz Simülasyonu'
          }
          subtitle="SE Primer: Oynanan Bir Kitap"
          statusText={currentState === 'ENDING' ? 'OTURUM ARŞİVLENDİ' : 'GÖREV AKTİF'}
        />

        {/* State Machine Views */}
        <main className="flex-1 flex flex-col">
          {currentState === 'GIRIS' && (
            <IntroScreen
              level={level}
              role={role}
              goal={goal}
              onSelectLevel={setLevel}
              onSelectRole={setRole}
              onSelectGoal={setGoal}
              onStart={() => {
                setCurrentState('K1');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {isSceneState && (
            <DecisionScene
              decision={currentDecision}
              level={level ?? 0}
              role={role ?? 0}
              goal={goal ?? 0}
              currentTimeString={currentClockTime}
              selectedOption={choices[currentDecisionId]?.chosen || null}
              timedOut={choices[currentDecisionId]?.timedOut || false}
              onSelectOption={handleSelectOption}
              onContinue={handleContinue}
              onOpenTutor={() => setIsTutorOpen(true)}
            />
          )}

          {currentState === 'ENDING' && (
            <EndingScreen
              choices={choices}
              onRestart={handleRestart}
              onOpenPostMortem={() => setIsPostMortemOpen(true)}
            />
          )}
        </main>

        {/* AI Tutor Bottom Sheet / Drawer */}
        <TutorDrawer
          isOpen={isTutorOpen}
          onClose={() => setIsTutorOpen(false)}
          context={tutorContext}
          initialQuestion={currentDecision.tutorDefaultQuestion}
        />

        {/* Post Mortem Report Modal */}
        <PostMortemModal
          isOpen={isPostMortemOpen}
          onClose={() => setIsPostMortemOpen(false)}
          choices={choices}
        />
      </div>
    </div>
  );
}
