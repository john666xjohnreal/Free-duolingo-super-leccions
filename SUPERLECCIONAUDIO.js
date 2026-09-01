fetch('https://zombie.duolingo.com/64/web.json?user=1403676764&ts=1788278501&tzoffset=-5')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
fetch('https://greasyfork.org/es-419/scripts/561041-duolingo-duohacker/code')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
