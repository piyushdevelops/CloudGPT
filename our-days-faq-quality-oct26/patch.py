from pathlib import Path
p=Path('index.html')
s=p.read_text(encoding='utf-8')
needle='''        <details><summary>What happens after I choose a plan?<span>+</span></summary><p>Complete checkout, then we’ll guide you through the recipient, start date and prompt preferences for your chapter.</p></details>'''
add='''        <details><summary>What paper and finish do you use?<span>+</span></summary><p>Each Our Days book is printed on premium acid-free photo paper for crisp detail and rich colour. The hardcover has a smooth matte lamination that helps reduce glare and protects it from everyday scuffs.</p></details>
        <details><summary>Will the photos stay vibrant over time?<span>+</span></summary><p>Yes. High-quality printing and acid-free paper help resist yellowing and preserve colour, making your book a long-lasting keepsake. For the best life, store it flat in a cool, dry place away from direct sunlight.</p></details>
        <details><summary>Are phone photos good enough to print?<span>+</span></summary><p>Most modern phone photos print beautifully. We preserve the highest available quality and flag images that may look soft, so you can replace them before approving the final book.</p></details>'''
if needle not in s: raise SystemExit('FAQ insertion anchor missing')
p.write_text(s.replace(needle, needle+'\n'+add, 1),encoding='utf-8')
