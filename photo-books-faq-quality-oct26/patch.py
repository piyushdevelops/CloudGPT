from pathlib import Path
root=Path(r'photo-books-faq-quality-oct26/remote-before/templates')
files=[root/'collection.photo-books.json', root/'page.photo-books.json']
insert='''        "f4": {
          "type": "faq",
          "settings": {
            "q": "What paper and finish do you use?",
            "a": "<p>Each album is printed on premium acid-free photo paper for crisp detail and rich colour. The cover has a smooth matte lamination that helps reduce glare and protects it from everyday scuffs.</p>"
          }
        },
        "f5": {
          "type": "faq",
          "settings": {
            "q": "Will the photos stay vibrant over time?",
            "a": "<p>Yes. High-quality printing and acid-free paper help resist yellowing and preserve colour, making the album suitable as a long-lasting keepsake. For the best life, store it flat in a cool, dry place away from direct sunlight.</p>"
          }
        },
        "f6": {
          "type": "faq",
          "settings": {
            "q": "Is the album made for regular handling?",
            "a": "<p>Yes. The sturdy hardcover, protective matte lamination and premium pages are chosen for an album that can be opened, shared and enjoyed for years.</p>"
          }
        }
'''
needle='''        "f3": {
          "type": "faq",
          "settings": {
            "q": "Can I review it before ordering?",
            "a": "<p>Yes. Preview the album, review the final price and download a PDF before adding it to your bag.</p>"
          }
        }
'''
replacement=needle[:-1]+',\n'+insert
order='''        "f1",
        "f2",
        "f3"
'''
order2='''        "f1",
        "f2",
        "f3",
        "f4",
        "f5",
        "f6"
'''
for p in files:
    s=p.read_text(encoding='utf-8')
    if needle not in s or order not in s: raise SystemExit(f'expected anchors missing in {p}')
    s=s.replace(needle,replacement,1).replace(order,order2,1)
    p.write_text(s,encoding='utf-8')
