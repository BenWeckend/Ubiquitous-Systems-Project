#import "tubaf_template.typ" as tubaf


// function for table of symbols and acronyms
#let table_of_symbols() = {
  show outline: set heading(outlined: true)
  outline(
    title: "Symbol- und Abkürzungsverzeichnis",
    target: figure.where(caption: "-")
  )

  text()[*Formelzeichen*]
  grid(
    columns: (1fr, 1cm, 8fr),
    gutter: .5em,
    $bb(Z)$, "", [Menge der ganzen Zahlen],
    $bb(R)$, "", [Menge der reellen Zahlen],
  )

  linebreak()
  text()[*Abkürzungen*]
  grid(
    columns: (1fr, 1cm, 8fr),
    gutter: .5em,
    "Cobot", "", [kollaborativer Roboter],
  )
}


// report template
#show: tubaf.report.with(
  type: "Projektbericht",
  title: "Report: Tangible Interface Desk",
  subtitle: "Interactive Ubiquitous Systems and Intelligent User Interfaces",
  authors: ((
    name: "Georg, Jason, Marvin, Ben",
    studentID: "12345, 67890, 13579, 24680",
  ),),
  supervisors: ((
    title: "Dr.",
    name: "Akshay Deshmukh",
  ),),
  examiners: ((
    title: "Dr.",
    name: "Akshay Deshmukh",
  ),),
  lang: "de",
  extra_outlines: (table_of_symbols,),
  //references: "references.bib"
)

= Einleitung
#figure(
  image("TUBAF_Logo_blau.svg"),
  caption: tubaf.flex-caption(
    long: [Das Markenlogo ist das zentrale, identitätsstiftende Kernelement im visuellen Auftritt der Universität.],
    short: [Markenlogo])
)
#lorem(100)


= Wissensstand
#lorem(200)


*Die folgenden Hinweise sind eher nicht in einer Abschlussarbeit zu verwenden, da sie zu informell sind, aber für Praktika etc. vlt:*
#tubaf.note([Dies ist ein informeller Hinweis])

#tubaf.tip([Verwende diese Sektion, für Tipps.])

#tubaf.warning([Dies ist eine Warnung.])

= Untersuchungen
#lorem(50)
== Lösungsweg
#lorem(200)
=== Berechnungen
#lorem(100)
== Planung
#lorem(200)
== Durchführung
#lorem(200)

= Ergebnisse
#lorem(300)

= Zusammenfassung
#lorem(100)
