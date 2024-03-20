<script lang="ts">
    import FloatingWindow from "./wrapper/FloatingWindow.svelte";
    import { showDataInfo } from "./store";

    function hideDataInfo() {
        showDataInfo.set(false);
    }


</script>

<FloatingWindow on:click={hideDataInfo}>
<div class="datainfo">
    <h1 class="text-large">Your Data Is Private</h1>
    <p class="italic text-small">
        At <a href="https://yssentyl.com/">Yssentyl Technologies</a>, we understand that your data is important to you, and we want to ensure that you feel confident and secure when using our services. Here's what happens to your data:
    </p>

    <h2 class="text-medium">Storage Method:</h2>

    <p class="text-small">
        Your data is stored locally on your computer using a technology called IndexedDB. This means that when you use our web app, the information you input is saved directly onto your device. IndexedDB is a reliable method for storing data within your browser, allowing for quick access and seamless integration with Vyssuals.com.
    </p>

    <h2 class="text-medium">Availability for Future Sessions:</h2>

    <p class="text-small">
        One of the benefits of storing your data using IndexedDB is that it remains accessible for future sessions on the same computer. This means that when you return to our web app using the same device, your previous data will be readily available, allowing you to pick up right where you left off. Keep in mind, that your data will not be available on other devices you are using, nor will it be available to other users on the same device.
    </p>

    <h2 class="text-medium">Data Deletion:</h2>

    <p class="text-small">
        Your data will only be deleted under specific circumstances:
        <ul class="text-small">
            <li>You actively clear your browser's cache.</li>
            <li>You are using a private browser session to access <a href="https://vyssuals.com/">Vyssuals.com</a> and you close the browser.</li>
            <li>Your organization may have implemented automatic clearance settings within your browser or according to internal policies.</li>
        </ul>

    <h2 class="text-medium">Data Privacy:</h2>

    <p class="text-small">
        We want to reassure you that your data is not sent to any cloud storage or third-party servers. Your information remains securely stored on your device, giving you full control over your data at all times. We prioritize your privacy and confidentiality, and we are committed to ensuring that your data is handled responsibly and securely.
    </p>
</div>
</FloatingWindow>

<style>
    .datainfo {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        max-width: 600px;
        gap: 10px;
        background-color: var(--card-background-color);
        border-radius: 1em;
        padding: 2rem;
    }

    .text-small {
        font-size: 0.9rem;
        font-weight: 300;
        margin: 0;
    }

    .text-medium {
        font-size: 1.2rem;
        font-weight: 500;
        margin: 0;
        text-align: left;
    }

    .text-large {
        font-size: 2rem;
        font-weight: 700;
        margin: 0;
    }

    .italic {
        font-style: italic;
    }

    a {
        color: steelblue;
    }
</style>