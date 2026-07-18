export default () => ({

    modalLoaderContent: 'Loading content...',

    init() {

        const modalLoaderElement = document.getElementById('modal_loader')
    
        if (modalLoaderElement) {
            // 2. Listen for Bootstrap's event that triggers immediately when closing starts
            modalLoaderElement.addEventListener('hide.bs.modal', () => {
                // Find whichever element inside the modal currently has browser focus
                const activeElement = document.activeElement
                
                // If the focused element is inside this modal, force it to blur (lose focus)
                if (activeElement && modalLoaderElement.contains(activeElement)) {
                    activeElement.blur()
                }
            })
        }

        const modalLoaderTrigger = document.getElementById('modal_loader_trigger')

        if (modalLoaderTrigger) {

            modalLoaderTrigger.addEventListener('click', async (e) => {

                e.preventDefault()

                const url = e.currentTarget.getAttribute('href')
                this.modalLoaderContent = 'Loading Content...'

                try {
                    
                    const response = await fetch(url)

                    if (!response) throw new Error('Network response was not ok')

                    const html = await response.text()

                    this.modalLoaderContent = html
                } catch (error) {

                    console.error('Fetch error:', error)
                    this.modalLoaderContent = '<div class="alert alert-danger">Failed to load content.</div>'
                }
            })
        }
    }
})