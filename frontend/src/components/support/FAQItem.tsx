import React, { useState } from 'react';
import { ChevronDown, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FAQ } from '@/hooks/useSupport';
import { cn } from '@/lib/utils';

interface FAQItemProps {
  faq: FAQ;
  isExpanded: boolean;
  onClick: () => void;
  onFeedback: (faqId: string, isHelpful: boolean) => void;
  language: 'ka' | 'en';
}

export const FAQItem: React.FC<FAQItemProps> = ({
  faq,
  isExpanded,
  onClick,
  onFeedback,
  language,
}) => {
  const [feedbackGiven, setFeedbackGiven] = useState<'yes' | 'no' | null>(null);

  const question = language === 'ka' ? faq.question_ka : faq.question_en;
  const answer = language === 'ka' ? faq.answer_ka : faq.answer_en;

  const handleFeedback = (isHelpful: boolean) => {
    if (feedbackGiven) return;
    setFeedbackGiven(isHelpful ? 'yes' : 'no');
    onFeedback(faq.id, isHelpful);
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
      >
        <span className="font-medium text-sm pr-4">{question}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform',
            isExpanded && 'rotate-180'
          )}
        />
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 pt-0 space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {answer}
          </p>
          
          {/* Feedback */}
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-xs text-muted-foreground">
              {language === 'ka' ? 'დაგეხმარა?' : 'Was this helpful?'}
            </span>
            
            {feedbackGiven ? (
              <span className="text-xs text-muted-foreground">
                {language === 'ka' ? 'მადლობა!' : 'Thanks!'}
              </span>
            ) : (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFeedback(true);
                  }}
                  className="h-7 px-2 text-xs"
                >
                  <ThumbsUp className="h-3 w-3 mr-1" />
                  {language === 'ka' ? 'დიახ' : 'Yes'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFeedback(false);
                  }}
                  className="h-7 px-2 text-xs"
                >
                  <ThumbsDown className="h-3 w-3 mr-1" />
                  {language === 'ka' ? 'არა' : 'No'}
                </Button>
              </div>
            )}
          </div>
          
          {/* Stats */}
          {faq.helpful_yes > 0 && (
            <p className="text-xs text-muted-foreground">
              {faq.helpful_yes} {language === 'ka' ? 'ადამიანს დაეხმარა' : 'people found this helpful'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
