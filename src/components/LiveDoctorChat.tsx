import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Stethoscope,
  Sparkles,
  AlertTriangle,
  HelpCircle,
  RefreshCw,
  Copy,
  Check,
  User,
  ShieldAlert,
  ArrowDownCircle,
  Activity,
  ChevronRight
} from 'lucide-react';
import { ClinicalCaseInput, ClinicalEngineOutput, DoctorChatMessage } from '../types';

interface LiveDoctorChatProps {
  currentPatient: ClinicalCaseInput;
  output: ClinicalEngineOutput | null;
}

interface StandardQuestion {
  id: string;
  category: string;
  label: string;
  prompt: string;
  badge: string;
}

export const LiveDoctorChat: React.FC<LiveDoctorChatProps> = ({
  currentPatient,
  output
}) => {
  const [messages, setMessages] = useState<DoctorChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Standard pre-defined clinical questions tailored to patient safety
  const standardQuestions: StandardQuestion[] = [
    {
      id: 'sq-1',
      category: 'Dosage & Safety',
      label: 'Why is doubling my Lisinopril dose risky?',
      prompt: 'Could you explain why doubling my Lisinopril dose without titration is dangerous with my kidney condition?',
      badge: 'High Priority'
    },
    {
      id: 'sq-2',
      category: 'Medication Side Effects',
      label: 'Why stop Atorvastatin after muscle cramping?',
      prompt: 'Why was my Atorvastatin stopped after I had calf cramps, and what symptoms should I monitor?',
      badge: 'Side Effect'
    },
    {
      id: 'sq-3',
      category: 'Lab Interpretation',
      label: 'Are my Potassium & Creatinine levels dangerous?',
      prompt: 'Could you explain what my recent Potassium (5.4) and Creatinine (1.48) lab results mean for my kidneys?',
      badge: 'Lab Finding'
    },
    {
      id: 'sq-4',
      category: 'OTC Drug Safety',
      label: 'Can I take Ibuprofen for pain with kidney disease?',
      prompt: 'Is it safe for me to take over-the-counter Ibuprofen or Advil for joint pain with my kidney health history?',
      badge: 'Drug Interaction'
    },
    {
      id: 'sq-5',
      category: 'Blood Thinner Transition',
      label: 'How to switch between Warfarin & Apixaban?',
      prompt: 'How do I safely transition between Warfarin and Apixaban (Eliquis), and why should I avoid St. Johns Wort?',
      badge: 'Anticoagulation'
    },
    {
      id: 'sq-6',
      category: 'Allergy Warning',
      label: 'Can I take leftover Amoxicillin for tooth pain?',
      prompt: 'Can I take leftover Amoxicillin for dental pain given my history of Penicillin allergy?',
      badge: 'Allergy Guard'
    },
    {
      id: 'sq-7',
      category: 'Emergency Escalation',
      label: 'What red-flag symptoms require urgent care or ER?',
      prompt: 'What specific warning symptoms should prompt me to go to the emergency room immediately?',
      badge: 'Emergency Signs'
    }
  ];

  // Initialize or reset chat when active patient changes
  useEffect(() => {
    const welcomeMessage: DoctorChatMessage = {
      id: `msg-welcome-${currentPatient.patient_id}`,
      sender: 'doctor',
      text: `Hello ${currentPatient.patient_name}. I am **Dr. Meredith Reed, MD**, your attending physician in Internal Medicine and Clinical Pharmacology at the neuro Agent Medical Center.

I have your active clinical record, recent vital signs, medication history, and timestamped lab panels open in front of me. 

How are you feeling today? You can choose from the **standard clinical questions below** or type any specific questions regarding your prescriptions, test results, or care plan.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([welcomeMessage]);
  }, [currentPatient.patient_id, currentPatient.patient_name]);

  // Auto-scroll to bottom of conversation
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Send query to the backend live doctor endpoint
  const sendMessage = async (textToSend: string, isStandard = false, standardLabel?: string) => {
    if (!textToSend.trim() || isTyping) return;

    const userMessage: DoctorChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStandardQuestion: isStandard,
      standardQuestionLabel: standardLabel
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat-doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          history: newMessages.map(m => ({ sender: m.sender, text: m.text })),
          caseData: currentPatient,
          output: output || undefined
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data = await response.json();
      const doctorReply: DoctorChatMessage = {
        id: `msg-doc-${Date.now()}`,
        sender: 'doctor',
        text: data.reply || 'Thank you for your question. I am reviewing your chart carefully.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, doctorReply]);
    } catch (err) {
      console.error('Doctor consultation API error:', err);
      // Fallback response in case of network issue
      const fallbackReply: DoctorChatMessage = {
        id: `msg-doc-fallback-${Date.now()}`,
        sender: 'doctor',
        text: `Thank you, ${currentPatient.patient_name}. I have registered your question regarding "${textToSend}". 

As a key safety principle: Always consult with our clinic before taking any new prescription, over-the-counter medicine, or altering current doses. If you experience severe chest pain, shortness of breath, dizziness, or allergic swelling, seek emergency care immediately.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackReply]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col h-[760px] max-h-[82vh] overflow-hidden">
      
      {/* 1. Header: Doctor Profile & Live Status */}
      <div className="bg-gradient-to-r from-[#072a35] via-[#0b4859] to-[#0f766e] p-4 sm:p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center space-x-3.5">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
              <Stethoscope className="w-6 h-6 text-teal-200" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#072a35] rounded-full animate-pulse"></span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold tracking-tight text-white">
                Dr. Meredith Reed, MD
              </h2>
              <span className="px-2 py-0.5 bg-teal-400/20 text-teal-200 text-[10px] font-semibold rounded-full border border-teal-300/30">
                Attending Physician
              </span>
            </div>
            <p className="text-xs text-teal-100/80">
              Internal Medicine &amp; Clinical Pharmacology • neuro Agent Medical Center
            </p>
          </div>
        </div>

        {/* Active Consultation Badge */}
        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-xs text-teal-100 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-medium">Active Consultation:</span>
          <span className="font-bold text-white">{currentPatient.patient_name}</span>
          <span className="text-teal-200/60 font-mono text-[11px]">({currentPatient.patient_id})</span>
        </div>
      </div>

      {/* 2. Standard Questions Quick Selector Bar */}
      <div className="bg-slate-50 border-b border-slate-200/80 p-3 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
            <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
            <span>Standard Clinical Questions</span>
            <span className="text-[10px] font-normal text-slate-500 hidden sm:inline">
              (Click any question to ask Dr. Reed instantly)
            </span>
          </div>
          <span className="text-[10px] font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
            {standardQuestions.length} standard presets
          </span>
        </div>

        {/* Scrollable Questions Carousel */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-thin">
          {standardQuestions.map(q => (
            <button
              key={q.id}
              id={`btn-${q.id}`}
              onClick={() => sendMessage(q.prompt, true, q.label)}
              disabled={isTyping}
              className="group text-left px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-teal-50/80 hover:border-teal-300 transition-all text-xs text-slate-700 hover:text-teal-900 shadow-2xs whitespace-nowrap flex items-center space-x-2 shrink-0 disabled:opacity-50"
              title={q.prompt}
            >
              <span className="text-[9px] uppercase tracking-wider font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200/60 group-hover:bg-teal-100">
                {q.badge}
              </span>
              <span className="font-medium">{q.label}</span>
              <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ))}
        </div>
      </div>

      {/* 3. Messages Chat Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40">
        {messages.map((msg) => {
          const isDoc = msg.sender === 'doctor';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isDoc ? 'justify-start' : 'justify-end'}`}
            >
              {isDoc && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0b4859] to-[#0d9488] text-white flex items-center justify-center shrink-0 shadow-2xs mt-1">
                  <Stethoscope className="w-4 h-4 text-white" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed transition-all shadow-xs ${
                  isDoc
                    ? 'bg-white border border-slate-200/80 text-slate-800'
                    : 'bg-[#093d4c] text-white rounded-br-xs'
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-slate-100 dark:border-white/10">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold">
                      {isDoc ? 'Dr. Meredith Reed, MD' : currentPatient.patient_name}
                    </span>
                    {isDoc && (
                      <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                        Attending
                      </span>
                    )}
                    {msg.isStandardQuestion && (
                      <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                        Standard Query
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] font-mono ${isDoc ? 'text-slate-400' : 'text-teal-100/70'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {/* Message Body with Markdown formatting support */}
                <div className="whitespace-pre-wrap space-y-2">
                  {msg.text.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className={isDoc ? 'text-slate-700' : 'text-teal-50'}>
                      {paragraph.split('**').map((chunk, cIdx) => 
                        cIdx % 2 === 1 ? (
                          <strong key={cIdx} className={isDoc ? 'text-slate-900 font-semibold' : 'text-white font-semibold'}>
                            {chunk}
                          </strong>
                        ) : chunk
                      )}
                    </p>
                  ))}
                </div>

                {/* Doctor Action Footer (Copy, Verified Badge) */}
                {isDoc && (
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center space-x-1 text-emerald-600 font-medium">
                      <Sparkles className="w-3 h-3" />
                      <span>neuro Agent Grounded</span>
                    </div>

                    <button
                      onClick={() => copyToClipboard(msg.text, msg.id)}
                      className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors flex items-center space-x-1"
                      title="Copy doctor response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-[10px] text-emerald-600 font-medium">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="text-[10px]">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {!isDoc && (
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 shadow-2xs mt-1 font-bold text-xs">
                  {currentPatient.patient_name.charAt(0)}
                </div>
              )}
            </div>
          );
        })}

        {/* Live Typing Indicator */}
        {isTyping && (
          <div className="flex items-start gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0b4859] to-[#0d9488] text-white flex items-center justify-center shrink-0 shadow-2xs mt-1">
              <Stethoscope className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-xs flex items-center space-x-2 text-xs text-slate-500">
              <div className="flex space-x-1">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-bounce [animation-delay:0.4s]"></span>
              </div>
              <span className="font-medium text-slate-600">
                Dr. Reed is reviewing {currentPatient.patient_name}&apos;s lab panels and records...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. Safety Guardrail Alert Footer */}
      <div className="px-4 py-1.5 bg-amber-50/80 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-amber-800 shrink-0">
        <div className="flex items-center space-x-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>
            <strong>Clinical Safety Notice:</strong> Live consultation guidance is advisory and grounded in synthetic medical records. For acute chest pain, shortness of breath, or sudden weakness, call 911 immediately.
          </span>
        </div>
      </div>

      {/* 5. Input Area */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(inputText);
          }}
          className="flex items-end space-x-2"
        >
          <div className="flex-1 relative">
            <textarea
              id="live-chat-input"
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask Dr. Reed a clinical question about ${currentPatient.patient_name}'s medications, labs, or symptoms... (Press Enter to send)`}
              disabled={isTyping}
              className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 focus:outline-none transition-all pr-10"
            />
          </div>

          <button
            type="submit"
            id="live-chat-send-btn"
            disabled={!inputText.trim() || isTyping}
            className={`p-3 rounded-2xl font-bold transition-all shadow-xs flex items-center justify-center shrink-0 ${
              !inputText.trim() || isTyping
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white shadow-teal-700/20'
            }`}
            title="Send question to Dr. Reed"
            aria-label="Send message"
          >
            {isTyping ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>

        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>Target Patient: {currentPatient.patient_name} ({currentPatient.patient_id})</span>
          <span>Press Enter to send • Shift+Enter for newline</span>
        </div>
      </div>

    </div>
  );
};
