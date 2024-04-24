<script setup>
    import { ref, toRaw, onMounted } from 'vue'

    const view = ref('new')
    const page = ref({title: '', url: ''})
    const bookmarks = ref([])

    onMounted(() => {
        chrome.tabs.query({active: true, currentWindow: true}).then(([tab]) => {
            page.value.title = tab.title
            page.value.url = tab.url
        })

        chrome.storage.local.get({bookmarks: []}).then(data => {
            bookmarks.value.push(...data.bookmarks)
        })
    })

    function openLink(link) {
        chrome.tabs.create({url: link, active: true})
    }

    function saveBookmark() {
        bookmarks.value.unshift({
            title: page.value.title, 
            url: page.value.url
        })

        chrome.storage.local.set({
            bookmarks: toRaw(bookmarks.value)
        })

        view.value = 'list'
    }

    function removeBookmark(bookmark) {
        let index = bookmarks.value.findIndex(b => b === bookmark)
        let [deleted] = bookmarks.value.splice(index, 1)
        console.log('Bookmark deleted', deleted)

        chrome.storage.local.set({
            bookmarks: toRaw(bookmarks.value)
        })
    }
</script>

<template>
    <main class="flex flex-col w-[350px]" :class="{'max-h-[450px]': view === 'list'}">
        <header class="bg-indigo-500 flex justify-center items-center gap-1.5 py-2.5">
            <img src="icons/128.png" class="w-7 h-7">
            <span class="text-white text-2xl font-bold">URL Saver Extension</span>
        </header>

        <section v-if="view == 'new'" class="flex flex-col p-2 gap-2.5">
            <p class="text-center font-semibold text-xl">Bookmark this page</p>
            <input type="url" class="text-sm bg-gray-200/50 border border-indigo-500 px-1.5 py-1 rounded" :value="page.url" readonly>
            <input v-model="page.title" type="text" placeholder="Page Title" class="border border-indigo-500 px-1.5 py-1 rounded">
            
            <button @click="saveBookmark" class="flex justify-center items-center gap-1 bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                </svg> Save
            </button>
    
            <button @click="view = 'list'" class="mt-1 text-sm text-indigo-500 self-center">View All Bookmarks</button>
        </section>

        <section v-else-if="view == 'list'" class="flex flex-col p-2 gap-2.5 overflow-hidden">
            <p class="text-center font-semibold text-xl">My Bookmarks</p>

            <section class="flex flex-col gap-2 overflow-x-hidden overflow-y-auto no-scrollbar">

                <section v-for="bookmark in bookmarks" class="flex justify-between gap-5 p-1.5 border border-indigo-200 rounded shadow">
                    <div class="flex flex-col gap-0.5 overflow-hidden">
                        <span class="overflow-hidden whitespace-nowrap text-ellipsis">{{ bookmark.title }}</span>
                        <span @click="openLink(bookmark.url)" class="text-sm text-indigo-500 hover:text-indigo-600 cursor-pointer overflow-hidden whitespace-nowrap text-ellipsis">{{ bookmark.url }}</span>
                    </div>
                    
                    <button @click="removeBookmark(bookmark)" class="hover:text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                    </button>
                </section>

                <div v-if="!bookmarks.length" class="rounded border-s-4 border-yellow-500 bg-yellow-50 p-4">
                    <p class="text-sm text-yellow-700">No Bookmarks</p>
                </div>
            </section>

            <button @click="view = 'new'" class="flex items-center gap-1 text-sm text-indigo-500 self-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg> Back
            </button>
        </section>
    </main>
</template>