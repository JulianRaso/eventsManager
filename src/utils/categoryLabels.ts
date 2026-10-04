export const categoryLabels: Record<string, string> = {
  sound: "Sonido",
  lights: "Iluminación",
  ambientation: "Ambientación",
  structure: "Estructuras",
  cables: "Cables",
  screen: "Pantalla",
  furniture: "Muebles",
  tools: "Herramientas",
  others: "Otros",
};

export function getCategoryLabel(category?: string | null) {
  if (!category) return "—";
  return categoryLabels[category] ?? category;
}
