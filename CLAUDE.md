# CLAUDE.md: 802 Soul Kitchen Project Workflow

## Session Startup Protocol

1. **Read PLANNING.md** - Understand project vision, tech stack, and architecture decisions
2. **Read TASKS.md** - Review current task status and identify next priorities
3. **Check git status** - Understand current branch and uncommitted changes
4. **Review Session Log** - Understand recent progress and context

## Task Handling Protocol

### Task Selection
- Pick the **highest-priority open task** from TASKS.md based on:
  - Milestone dependencies (can't do Milestone 2 before Milestone 1)
  - Logical sequence within milestone
  - Unblocked status (all dependencies completed)

### Task Execution
1. **Announce task** - State which specific task is being executed
2. **Execute atomically** - Complete the entire task in one focused session
3. **Mark completion** - Update TASKS.md with `[x]` and `Completed: YYYY-MM-DD`
4. **Add discovered tasks** - If new tasks emerge, add to "Newly Discovered Tasks" with one-line reason

### Example Task Completion
```markdown
- [x] Initialize Astro project with TypeScript template
  **Completed:** 2024-03-15
```

### Example New Task Addition
```markdown
- [ ] Configure TypeScript strict mode for better type safety
  **Reason:** Discovered during Astro setup - needed for React island type checking
  **Completed:** ___________
```

## File Discipline Rules

### Before Writing Files
1. **Always diff first** - Use Read tool to check existing content before editing
2. **Never recreate files** - Always edit existing files rather than overwriting
3. **Scope changes narrowly** - Only modify what's needed for current task
4. **Preserve existing patterns** - Match existing code style and structure

### File Operations Priority
1. **Edit existing** > Create new
2. **Minimal changes** > Complete rewrites
3. **Current task scope** > Future optimizations
4. **Preserve working code** > Perfect refactoring

## Commit Guidelines

### Commit Message Format
```
<short-subject>: <one-line-why>

Task: <reference-to-specific-task>
```

### Examples
```
feat: add Astro TypeScript project structure
Initialize base framework for static site generation
Task: Initialize Astro project with TypeScript template

style: extract brand colors to Tailwind theme
Preserve existing brand identity in new styling system
Task: Create Tailwind theme configuration with brand tokens
```

### Commit Timing
- **One commit per completed task** - Never batch multiple tasks
- **Commit immediately after task completion** - Don't let work accumulate
- **Include task reference** - Always link back to specific TASKS.md item

## Safety Rails and Decision Points

### Before Adding New Libraries
**Always ask first with this format:**

> I need to add [LIBRARY_NAME] for [SPECIFIC_REASON]. Here are two options:
>
> **Option 1: [LIBRARY_NAME]**
> - Pros: [specific benefits]
> - Cons: [bundle size/complexity/maintenance concerns]
> - Bundle impact: [estimated size]
>
> **Option 2: [ALTERNATIVE_APPROACH]**
> - Pros: [specific benefits]
> - Cons: [limitations/development time]
> - Bundle impact: [estimated size]
>
> Which approach would you prefer?

### When to Ask for Guidance
- Adding any new dependency not already specified in PLANNING.md
- Changing tech stack decisions from original plan
- Major architectural deviations from established patterns
- Performance trade-offs that affect Core Web Vitals targets

## Session Closure Protocol

### Session Summary Format
Add to Session Log section:

```markdown
### Session YYYY-MM-DD
**Tasks Completed:**
- [x] Task description with completion reasoning
- [x] Another task with any blockers encountered

**Tasks Added:**
- [ ] New task with discovery reason

**Decisions Made:**
- Decision about X because Y
- Architectural choice Z due to constraint W

**Next Session Priority:**
- Specific next task to tackle
- Any prep work needed
```

## Quality Gates

### Before Marking Task Complete
- [ ] Task objective fully achieved
- [ ] No broken functionality introduced
- [ ] Code follows existing patterns
- [ ] Related files updated if needed
- [ ] Performance impact assessed
- [ ] Security implications considered

### Before Session End
- [ ] All work committed with proper messages
- [ ] TASKS.md updated with current status
- [ ] Session Summary added to log
- [ ] Next session priority identified

---

## Session Log

### Session 2024-09-27 (Stub)
**Tasks Completed:**
- [x] Created PLANNING.md with comprehensive technical strategy
- [x] Created TASKS.md with 10 milestones and atomic task breakdown
- [x] Created CLAUDE.md with project workflow rules

**Tasks Added:**
- None this session (planning phase)

**Decisions Made:**
- Established Astro + Tailwind + React islands architecture
- Defined atomic task structure for systematic progression
- Set up disciplined workflow for consistent execution

**Next Session Priority:**
- Initialize Astro project with TypeScript template (Task 1.1.1)
- Begin Milestone 1: Project Setup and Environment

**Context Notes:**
- Project structure designed around existing brand assets (802Logo.png, styles.css color palette)
- Performance targets: Lighthouse ≥90 mobile, <2s Time to Interactive
- Hosting constraint: iFastNet static files only

### Session 2025-09-27
**Major Changes Implemented:**
- [x] Fixed Firebase events query by removing `orderBy('order', 'asc')` that was filtering out all documents due to missing 'order' fields
- [x] Fixed missing `loadAvailablePhotos()` function call that was happening before function definition
- [x] Fixed admin panel text visibility by changing brand-white color from `#fdfcfd` to `#ffffff` and adding CSS overrides for admin panel content
- [x] Fixed admin panel background/text color conflicts with targeted CSS rules using brand dark blue `#060b22`
- [x] Implemented missing button handlers for "Add Menu Item", "Save Item", "Save Event", "Edit Menu Item", and "Edit Event" functionality
- [x] Added proper Firebase event data structure to match security rules (name, location, date, dateTimes fields)
- [x] Enhanced event save logic to preserve existing date/time data when editing existing events

**Tasks Added:**
- [ ] Implement date/time picker functionality for events admin panel
- [ ] Add proper event validation for start/end times in admin interface
- [ ] Fix Firebase security rules permissions issue for event updates
- [ ] Add "Add Event" button click handler (currently missing)

**Decisions Made:**
- Changed brand color palette: `--brand-white` from `#fdfcfd` to `#ffffff` for better visibility
- Used CSS `!important` overrides for admin panel text colors to ensure readability
- Implemented Firebase event updates to preserve existing complex date/time structures
- Added extensive debugging logs to track Firebase authentication and data validation

**Technical Risks Identified:**
- Firebase security rules still blocking event saves despite proper authentication - requires investigation
- Admin panel may have additional missing button handlers not yet discovered
- Date/time functionality in events is currently using placeholder data
- CSS color overrides using `!important` could conflict with future design changes

**Next 3 Tasks Priority:**
1. **Investigate Firebase permissions issue** - Debug why authenticated admin user still gets "insufficient permissions" error when saving events
2. **Find and implement missing "Add Event" button handler** - Complete the admin panel button functionality
3. **Implement proper date/time picker for events** - Replace placeholder date/time data with actual user input interface

**Context Notes:**
- Firebase authentication working perfectly (scottkunian@gmail.com verified and authorized)
- Event data structure matches Firebase security rules but still failing validation
- All admin panel text visibility issues resolved with brand color consistency