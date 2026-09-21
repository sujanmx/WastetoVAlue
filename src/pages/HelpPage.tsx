import React from 'react';
import { WorkspaceContainer } from '../components/layout/WorkspaceContainer';
import { Card } from '../components/common/Card';

export const HelpPage: React.FC = () => {
  return (
    <WorkspaceContainer maxWidth="md">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-text">Help & Documentation</h1>
        <p className="text-sm text-secondary-text mt-1">
          Understanding the Waste2Value circular intelligence workflows.
        </p>
      </div>

      <div className="space-y-4">
        {[
          {
            q: 'How does Vision AI identify items?',
            a: 'Vision AI analyzes pixel geometry, surface textures, and structural profiles to identify material categories and gauge physical wear without requiring barcode metadata.',
          },
          {
            q: 'How are circular pathways calculated?',
            a: 'Value AI uses the waste hierarchy: direct reuse is favored over donation, followed by secondary resale, and finally material disassembly & recycling.',
          },
          {
            q: 'How does receiver matching work?',
            a: 'Matching AI filters local organizations based on accepted materials, operating hours, and transportation distance.',
          },
        ].map((faq, i) => (
          <Card key={i} variant="resting" className="p-5">
            <h3 className="text-sm font-semibold text-primary-text mb-1">{faq.q}</h3>
            <p className="text-xs text-secondary-text leading-relaxed">{faq.a}</p>
          </Card>
        ))}
      </div>
    </WorkspaceContainer>
  );
};
