import { rm } from 'fs/promises'
import { join } from 'path'

const cleanCypress = async () => {
  const folders = ['videos', 'screenshots', 'reports']
  
  for (const folder of folders) {
    try {
      await rm(join(process.cwd(), 'cypress', folder), { recursive: true, force: true })
      console.log(`✔ Cleaned ${folder}`)
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error(`Error cleaning ${folder}:`, error)
      }
    }
  }
}

cleanCypress() 