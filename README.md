# bgetem_open_street_map

## Verwendung
Die Karte kann in ein bestehendes HTML-Dokument eingebunden werden. Dies geschieht, indem man ein div mit der id `olmap` erstellt, das später durch die Karte ersetzt wird und außerdem die Datei dist.js (Herunterladbar unter Releases) als Script mit einbindet.  
Beispiel:
``` html
<html xmlns="http://www.w3.org/1999/xhtml" lang="de">
<head>
    <meta charset="utf-8">
    <title>OSME</title>
</head>
<body>
<custom-osm locations='[{"title":"Niederlassung Fürth","lon":10.986680,"lat":49.470240,"color":"#014b94"},{"title":"Süße Freiheit","lon":10.990280,"lat":49.472500,"color":"#d70007"}]'></custom-osm>

<script src="dist.js"></script>
</body>
</html>
```
`color` ist hierbei optional
