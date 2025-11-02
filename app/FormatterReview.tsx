import React from "react";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism-tomorrow.css";

export function FormattedReview({ review }: { review: string }) {
  const formatted = review
    .replace(/### (.*?):/g, "<h3 class='text-[#66ffcc] font-semibold mt-3 mb-1'>$1:</h3>")
    .replace(/^❌(.*)$/gm, "<div class='text-[#ff6666] font-semibold'>❌$1</div>")
    .replace(/^✅(.*)$/gm, "<div class='text-[#66ffcc] font-semibold'>✅$1</div>")
    .replace(/^⚠️(.*)$/gm, "<div class='text-[#ffcc66] font-semibold'>⚠️$1</div>")
    .replace(/```(.*?)\n([\s\S]*?)```/g, (_, lang, code) => {
      const highlighted = Prism.highlight(
        code.trim(),
        Prism.languages[lang] || Prism.languages.javascript,
        lang
      );
      return `
        <pre class='rounded-lg border border-[#334155] bg-[#0f172a]/80 p-3 overflow-x-auto mb-2'>
          <code class='language-${lang} text-[#a5b4fc]'>${highlighted}</code>
        </pre>`;
    })
    .replace(/\n/g, "<br/>");

  return (
    <div
      className="prose prose-invert max-w-none leading-relaxed"
      dangerouslySetInnerHTML={{ __html: formatted }}
    />
  );
}
