import { icons } from "@/components/icons/icons"

export const EXPIRY_TIMES = [
    { value: "never", label: "Never", ms: null },
    { value: "10m", label: "10 minutes", ms: 1000 * 60 * 10 },
    { value: "1h", label: "1 hour", ms: 1000 * 60 * 60 },
    { value: "1d", label: "1 day", ms: 1000 * 60 * 60 * 24 },
    { value: "7d", label: "7 days", ms: 1000 * 60 * 60 * 24 * 7 },
    { value: "30d", label: "30 days", ms: 1000 * 60 * 60 * 24 * 30 },
] as const;

export const VIEW_LIMITS = [
    { value: 1, label: "1 view" },
    { value: 10, label: "10 views" },
    { value: 100, label: "100 views" },
] as const;

export const SYNTAX_LANGUAGES = [
    { value: "text", label: "Text", icon: "" },
    { value: "csharp", label: "C#", icon: icons.CSharp },
    { value: "javascript", label: "JavaScript", icon: icons.JavaScript },
    { value: "python", label: "Python", icon: icons.Python },
    { value: "java", label: "Java", icon: icons.Java },
    { value: "cpp", label: "C++", icon: icons.CPP },
    { value: "c", label: "C", icon: icons.C },
    { value: "html", label: "HTML", icon: icons.HTML },
    { value: "css", label: "CSS", icon: icons.CSS },
    { value: "sql", label: "SQL", icon: "" },
    { value: "php", label: "PHP", icon: icons.PHP },
    { value: "ruby", label: "Ruby", icon: icons.Ruby },
    { value: "swift", label: "Swift", icon: icons.Swift },
    { value: "json", label: "JSON", icon: icons.JSON },
    { value: "markdown", label: "Markdown", icon: icons.Markdown },
    { value: "typescript", label: "TypeScript", icon: icons.TypeScript },
    { value: "rust", label: "Rust", icon: icons.Rust }
] as const;
