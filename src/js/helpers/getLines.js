export default function getLines(ctx, text, maxWidth) {
  let words = text.split(" ")
  let lines = []
  let currentLine = ""
  let leftover

  for (let i = 0; i < words.length; i++) {
    let word = words[i]
    if (currentLine === "") {
      currentLine += word
    } else {
      currentLine += " " + word
    }

    while (ctx.measureText(currentLine).width > maxWidth) {
      if (currentLine === word) {
        // Break up long string of text
        currentLine = ""
        for (let j = 0; j < word.length; j++) {
          if (ctx.measureText(currentLine + word[j]).width >= maxWidth) {
            leftover = word.slice(j)
            words.splice(i + 1, 0, leftover)
            lines.push(currentLine)
            currentLine = ""
            break
          } else {
            currentLine += word[j]
          }
        }
      } else {
        // Push current line and use current word for next line
        const updatedLine = currentLine.slice(
          0,
          currentLine.length - word?.length ?? 0
        )
        lines.push(updatedLine)
        currentLine = word
      }
    }

    if (i === words.length - 1) {
      lines.push(currentLine)
    }
  }

  return lines
}
