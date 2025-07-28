const fs = require('fs');

(async () => {
  const res = await fetch('https://leetcode-api-pied.vercel.app/problems');
  const json = await res.json();

  const simplified = json.map((p) => ({

    titleSlug: p.title_slug,
    url: p.url,
    difficulty: p.difficulty,
  }));

  fs.writeFileSync('./public/data/leetcodeProblems.json', JSON.stringify(simplified, null, 2));
  console.log('✅ Saved leetcodeProblems.json with', simplified.length, 'problems');
})();
