import type { ApplicationService } from '@adonisjs/core/types'
import { existsSync, readdirSync } from 'node:fs'
import edge from 'edge.js'

export default class AppProvider {
  constructor(protected app: ApplicationService) {}

  /**
   * Register bindings to the container
   */
  register() {}

  /**
   * The container bindings have booted
   */
  async boot() {

    const modulePath = this.app.makePath('app/modules')

    if (existsSync(modulePath)) {

      const modules = readdirSync(modulePath)

      for (const module of modules) {
        
        const viewDir = this.app.makePath(`app/modules/${module}/views`)
        if (existsSync(viewDir)) {

          edge.mount(module, viewDir)
        }
      }
    }
  }

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}