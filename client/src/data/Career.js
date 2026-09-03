// Each object is a "year group" — one dot + one year label on the timeline.
// A group can hold multiple positions (e.g. a promotion within the same era),
// like "Supervisor" sitting inside the "2024 - PRESENT" group in the design.
//
// ORDER = DISPLAY ORDER. The array is rendered top to bottom exactly as written,
// so put the most recent group first. To reorder, just move a whole group object
// up or down in this array — nothing else needs to change.

const career = [
  {
    yearRange: "2026 - PRESENT",
    positions: [
      {
        title: "Architectural Designer (Part-Time)",
        dateRange: "2026 - PRESENT",
        company: "Dezign Assist Ph",
        highlighted: false,
        bullets: [
          "Supported the Lead Designer by creating and revising residential plans in Chief Architect for custom home projects.",
        ],
      },
    ],
  },
  {
    yearRange: "2024 - PRESENT",
    positions: [
      {
        title: "Assistant Manager – Store Design",
        dateRange: "APRIL 2025 - PRESENT",
        company: "Watsons Personal Care Stores (Phils.), Inc.",
        highlighted: false,
        bullets: [
          "Lead design execution for new store rollouts and major renovations across the country.",
          "Collaborated with external consultants and suppliers for design execution, fixture detailing, and material sourcing.",
          "Reviewed layout plans, 3D visuals, and technical drawings for accuracy, functionality, and cost-efficiency.",
        ],
      },
      {
        title: "Supervisor – Store Design",
        dateRange: "SEPTEMBER 2024 - MARCH 2025",
        company: "",
        highlighted: true,
        bullets: [
          "Overseeing the evaluation and approval of brand display entries to ensure alignment with in-store visual standards and customer experience goals.",
          "Managing the strategic placement of display racks and scheming of store zones.",
        ],
      },
    ],
  },
  {
    yearRange: "2023 - 2024",
    positions: [
      {
        title: "Freelance Architect",
        dateRange: "2023 - 2024",
        company: "Self-employed",
        highlighted: false,
        bullets: [
          "Specializing in residential projects, leading design from schematic phase through to construction drawings, ensuring cohesive and functional designs aligned with client needs and building standards.",
        ],
      },
    ],
  },
  {
    yearRange: "2022 - 2024",
    positions: [
      {
        title: "Drafter",
        dateRange: "2022 - 2024",
        company: "Hypenate Holdings, Inc.",
        highlighted: false,
        bullets: [
          "Transform sketch drawings into working documents.",
          "Optimizes technical drawings for material and machining process.",
          "Provide valuable support in training and development of new-hires in the department.",
        ],
      },
    ],
  },
  {
    yearRange: "2020 - 2022",
    positions: [
      {
        title: "Architectural Staff",
        dateRange: "2020 - 2022",
        company: "D.M. Consuji Inc.",
        highlighted: false,
        bullets: [
          "Prepared shop drawings in liaison with engineers implemented in the project.",
          "Produced as-built drawings and assisted in punch listing.",
        ],
      },
    ],
  },
  {
    yearRange: "2019 - 2020",
    positions: [
      {
        title: "Architectural Apprentice",
        dateRange: "2019 - 2020",
        company: "Department of Public Works and Highways",
        highlighted: false,
        bullets: [
          "Prepared working drawings and specifications under the supervision of the project architect.",
          "Assisted the project architect in conduction of site inspections.",
        ],
      },
    ],
  },
];

export default career;