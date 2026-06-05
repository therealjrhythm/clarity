import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assertBrandBriefQuality,
  assertBrandBriefSummaryQuality,
  assertFoundationQuestionHelpQuality,
  assertFoundationQuestionSetQuality,
  assertOverviewSectionReviewQuality,
} from "./quality.ts";
import type {
  BrandBriefResult,
  BrandBriefSummary,
  FoundationQuestionHelpResult,
  FoundationQuestionSet,
  OverviewSectionReview,
} from "./types.ts";

const prompt =
  "I am a music producer, and I need to design a landing page for my personal brand.";

const validQuestionSet: FoundationQuestionSet = {
  blocks: [
    {
      captured: "Project intent captured",
      chips: ["Artist name", "Bookings"],
      detail: "Confirm what this landing page should do.",
      id: "intent",
      questions: [
        {
          id: "intent-name",
          prompt:
            "What name should this personal brand, artist identity, or production project use on the landing page?",
          semantic: "projectName",
        },
        {
          id: "intent-goal",
          prompt:
            "Should this landing page primarily drive listens, bookings, collaborations, or story discovery?",
        },
      ],
      title: "Project Intent",
    },
    {
      captured: "Audience direction captured",
      chips: ["Fans", "Collaborators"],
      detail: "Clarify who the music producer landing page serves.",
      id: "audience",
      questions: [
        {
          id: "audience-1",
          prompt:
            "Who should this landing page speak to first: fans, artists, collaborators, or booking contacts?",
        },
      ],
      title: "Audience",
    },
    {
      captured: "Brand feel captured",
      chips: ["Atmospheric", "Premium"],
      detail: "Clarify the creative mood.",
      id: "feel",
      questions: [
        {
          id: "feel-1",
          prompt:
            "What should the landing page feel like when someone first hears or sees your music identity?",
        },
      ],
      title: "Brand Feel",
    },
    {
      captured: "Requirements captured",
      chips: ["Music player", "Contact CTA"],
      detail: "Clarify the practical needs.",
      id: "requirements",
      questions: [
        {
          id: "requirements-1",
          prompt:
            "What sections or calls to action must this music producer landing page include?",
        },
      ],
      title: "Requirements",
    },
  ],
  generatedAt: "2026-06-03T00:00:00.000Z",
  keywords: ["music producer", "landing page", "personal brand"],
  projectType: "Landing page",
  projectUnderstanding: {
    brandOrProjectName: "",
    businessType: "personal brand",
    confidence: "high",
    inferredButUnconfirmed: ["The user may want booking or collaboration inquiries."],
    knownDetails: [
      "The user is a music producer.",
      "The project is a landing page.",
      "The landing page is for a personal brand.",
    ],
    likelyAudience: ["fans", "artists", "collaborators", "booking contacts"],
    likelyGoals: [
      "introduce the producer identity",
      "showcase music",
      "drive bookings or collaborations",
    ],
    missingDetails: ["brand/project name", "primary CTA", "music style"],
    normalizedPromptSummary:
      "A music producer needs a landing page for a personal brand.",
    originalPrompt: prompt,
    projectSubtype: "personal brand landing page",
    projectType: "landing page",
    recommendedFoundationBlocks: [
      "Project Intent",
      "Audience",
      "Brand Feel",
      "Requirements",
    ],
    userRole: "music producer",
  },
  source: "api",
  suggestedName: "",
  summary: "A music producer needs a landing page for a personal brand.",
};

describe("AI response quality gates", () => {
  it("accepts a specific project understanding and foundation question set", () => {
    assert.doesNotThrow(() =>
      assertFoundationQuestionSetQuality(validQuestionSet, prompt),
    );
  });

  it("rejects a question set that ignores specific prompt details", () => {
    assert.throws(
      () =>
        assertFoundationQuestionSetQuality(
          {
            ...validQuestionSet,
            projectType: "Marketing project",
            projectUnderstanding: {
              ...validQuestionSet.projectUnderstanding,
              knownDetails: ["The user wants a marketing project."],
              projectType: "marketing project",
              userRole: "",
            },
          },
          prompt,
        ),
      /low quality/i,
    );
  });

  it("rejects malformed Help with AI phrasing", () => {
    const help: FoundationQuestionHelpResult = {
      bestFit: {
        answer:
          "I am a music producer, and I need to design a landing page for my personal brand. should focus this landing page around landing page.",
        rationale: "Repeats the prompt awkwardly.",
      },
      followUpQuestion: "What CTA matters most?",
      intro: "Here are directions.",
      model: "gemini-3.5-flash",
      options: [
        {
          answer:
            "I am a music producer, and I need to design a landing page for my personal brand. should focus this landing page around landing page.",
          id: "option_1",
          label: "Generic",
          rationale: "Too generic.",
        },
        {
          answer: "Use a landing page for landing page.",
          id: "option_2",
          label: "Repeating",
          rationale: "Repeats terms.",
        },
        {
          answer: "Answer the question by thinking about your audience.",
          id: "option_3",
          label: "Advice",
          rationale: "Advice instead of answer text.",
        },
      ],
      source: "api",
    };

    assert.throws(
      () =>
        assertFoundationQuestionHelpQuality(help, {
          projectType: "Landing page",
          questionPrompt:
            "What name should this personal brand, artist identity, or production project use on the landing page?",
        }),
      /low quality/i,
    );
  });

  it("accepts a field-ready Help with AI response", () => {
    const help: FoundationQuestionHelpResult = {
      bestFit: {
        answer:
          "The landing page should introduce my producer identity, make my sound immediately clear, and guide visitors toward listening, booking, or collaboration inquiries.",
        rationale:
          "It connects the user's role, page type, and likely visitor actions.",
      },
      followUpQuestion:
        "Should the primary action be listening to music, booking production work, or starting a collaboration?",
      intro: "These options keep the answer specific to a music producer landing page.",
      model: "gemini-3.5-flash",
      options: [
        {
          answer:
            "This landing page should present my music producer identity, showcase my sound, and make it easy for artists or collaborators to contact me.",
          id: "option_1",
          label: "Collaboration-led",
          rationale: "Focuses the page around artist and collaborator outreach.",
        },
        {
          answer:
            "This landing page should act as a polished home for my personal producer brand, pairing my story with music samples and a clear booking path.",
          id: "option_2",
          label: "Brand-led",
          rationale: "Balances identity, sound, and conversion.",
        },
        {
          answer:
            "This landing page should give visitors a quick sense of my sound, credibility, and creative point of view before inviting them to listen or reach out.",
          id: "option_3",
          label: "Experience-led",
          rationale: "Emphasizes the visitor's first impression.",
        },
      ],
      source: "api",
    };

    assert.doesNotThrow(() =>
      assertFoundationQuestionHelpQuality(help, {
        projectType: "Landing page",
        questionPrompt:
          "What should this landing page accomplish for your music producer brand?",
      }),
    );
  });

  it("accepts business-goal help answers that do not repeat the page type in every option", () => {
    const help: FoundationQuestionHelpResult = {
      bestFit: {
        answer:
          "The primary business goal is to turn interested artists into paid studio clients by making the producer's sound, credibility, and booking path immediately clear.",
        rationale:
          "It gives the project one measurable commercial outcome without flattening the music producer positioning.",
      },
      followUpQuestion:
        "Should the strongest call to action point toward beat licensing, studio bookings, sync licensing, or artist promotion?",
      intro:
        "These directions focus the music producer project around a clear business outcome.",
      model: "gemini-3.5-flash",
      options: [
        {
          answer:
            "The primary business goal is to sell beat licenses by quickly proving the producer's sound, catalog quality, and licensing process to serious artists.",
          id: "option_1",
          label: "Beat licensing",
          rationale:
            "This fits if the producer wants the page to convert traffic into beat-license revenue.",
        },
        {
          answer:
            "The primary business goal is to book studio clients by showing the producer's taste, credibility, and collaborative process in a way that makes reaching out feel easy.",
          id: "option_2",
          label: "Studio bookings",
          rationale:
            "This fits if the producer wants more direct client work and production sessions.",
        },
        {
          answer:
            "The primary business goal is to promote the producer's own artist releases by helping visitors understand the sound, story, and next place to listen.",
          id: "option_3",
          label: "Artist promotion",
          rationale:
            "This fits if the page is mainly an artist identity and release-discovery surface.",
        },
      ],
      source: "api",
    };

    assert.doesNotThrow(() =>
      assertFoundationQuestionHelpQuality(help, {
        projectType: "Landing page",
        questionPrompt:
          "What is the primary business goal of this landing page? (e.g., selling beat licenses, booking studio clients, showcasing a portfolio for sync licensing, or promoting your own artist releases?)",
      }),
    );
  });

  it("accepts a specific Brand Brief final-check summary", () => {
    const summary: BrandBriefSummary = {
      archetypeGuidance:
        "The archetype step should explore mastery, craft, emotional depth, and cultural credibility for a music producer identity.",
      audience:
        "Independent artists, vocalists, collaborators, and licensing partners who need emotionally driven production and a clear path to listen or inquire.",
      cohesionNotes: [
        "The foundation and brief align around producer authority, sound discovery, and conversion into booking or licensing conversations.",
      ],
      creativeDirection:
        "The visual direction should feel cinematic, premium, emotionally resonant, and grounded in the producer's craft.",
      generatedAt: "2026-06-04T00:00:00.000Z",
      keyRequirements: [
        "Show music samples",
        "Make booking or licensing inquiry paths clear",
      ],
      overview:
        "This is a landing page for a music producer personal brand that introduces the artist identity and supports listening, collaboration, booking, and licensing paths.",
      positioning:
        "Position the producer as a credible creative partner with a distinct sound, polished production value, and a clear professional inquiry path.",
      projectIntent:
        "Build a landing page for a music producer personal brand that presents Music From The Soul Productions and guides visitors toward meaningful next actions.",
      readiness: "ready_with_suggestions",
      risksOrOpenQuestions: [
        "The primary conversion path should be prioritized before later modules.",
      ],
      toneAndFeel:
        "The tone should be cinematic, refined, moody, and emotionally direct without becoming generic luxury language.",
    };

    assert.doesNotThrow(() =>
      assertBrandBriefSummaryQuality(summary, {
        context: [prompt, validQuestionSet],
      }),
    );
  });

  it("rejects a generic Brand Brief final-check summary", () => {
    const summary: BrandBriefSummary = {
      archetypeGuidance:
        "Explore a professional and modern brand personality for a strong digital experience.",
      audience: "Customers who want value from a modern brand.",
      cohesionNotes: ["The project has a professional and modern direction."],
      creativeDirection: "Create a professional and modern visual experience.",
      generatedAt: "2026-06-04T00:00:00.000Z",
      keyRequirements: ["Clear content"],
      overview: "A professional and modern marketing project for customers.",
      positioning: "Position the brand as professional and modern.",
      projectIntent: "Create a professional and modern project.",
      readiness: "ready",
      risksOrOpenQuestions: [],
      toneAndFeel: "Professional and modern.",
    };

    assert.throws(
      () =>
        assertBrandBriefSummaryQuality(summary, {
          context: [prompt, validQuestionSet],
        }),
      /low quality/i,
    );
  });

  it("accepts a project-specific Overview section review", () => {
    const review: OverviewSectionReview = {
      quickRead:
        "The Project Intent is strong because it connects the music producer identity to a landing page with booking, listening, and licensing goals.",
      suggestedRefinement:
        "This landing page should establish the producer's authority and guide visitors toward custom production inquiries while still supporting listening and licensing discovery.",
      suggestions: [
        "Clarify whether booking, beat licensing, or artist promotion is the primary conversion path.",
      ],
      verdict: "could_be_stronger",
      whatWorks: [
        "The section identifies the user as a music producer and keeps the landing page tied to a personal brand.",
      ],
    };

    assert.doesNotThrow(() =>
      assertOverviewSectionReviewQuality(review, {
        context: [prompt, validQuestionSet],
        sectionContent:
          "Project Intent: music producer landing page for personal brand, booking, licensing, and listening.",
      }),
    );
  });

  it("rejects a Brand Brief that is too generic for the saved foundation", () => {
    const brief: BrandBriefResult = {
      brief: {
        antiPatterns: ["Generic marketing language"],
        audience: "Customers who want a strong brand experience.",
        brandPersonality: ["Professional", "Modern"],
        constraints: ["Stay clear"],
        emotionalDirection: "The experience should feel professional and modern.",
        functionalRequirements: ["A website section"],
        keyMessages: ["We provide value"],
        nextQuestions: ["What should happen next?"],
        primaryGoal: "Create a strong digital experience.",
        signatureMoment: "A clean first impression.",
        summary: "A professional brand experience for customers.",
      },
      generatedAt: "2026-06-03T00:00:00.000Z",
      model: "gemini-3.5-flash",
      source: "api",
    };

    assert.throws(
      () =>
        assertBrandBriefQuality(brief, {
          projectType: "Landing page",
          requiredTerms: ["music", "producer", "landing"],
        }),
      /low quality/i,
    );
  });
});
