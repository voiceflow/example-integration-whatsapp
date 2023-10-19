# Example code for Voiceflow and WhatsApp integration
How to use WhatsApp Cloud API with Voiceflow Dialog Manager API
* * *


# Create an app on Facebook Developers portal

Follow the Get started guide here to create your app and get your WhatsApp token.
https://developers.facebook.com/docs/whatsapp/cloud-api/get-started
<br>

![Get Started](/doc/get-started.png)


## The app

Once **registered** as a dev, go to https://developers.facebook.com/apps/
<br>

Create a **new app** by clicking on ![create a new app](/doc/new-app.png)
<br>

Select "**Other**" for the use case ![business app](/doc/wa_create_app.png) and click **Next**
<br>

Select "**Business**" for app type ![business app](/doc/business-app.png) and click **Next**
<br>

Fill the **needed info** for the app creation ![app info](/doc/app-info.png) and click **Create app**
<br>

On the next page, scroll down to the WhatsApp integration
![whatsapp integration](/doc/whatsapp-setup.png)
and click on **Set up**
<br><br>

Create a Business account (or select an existing one)
![business account](/doc/business-account.png)<br>
<br>

Go to https://business.facebook.com/home/accounts to **add a system user**.
Select your Business account and **click on the gear** (Settings)
![business account](/doc/wa_b_settings.png)<br>


In Users section, select System users and then click on **Add**
![business account](/doc/wa_b_add.png)
<br>

Create a new system user with the **Admin** role
![business account](/doc/wa_user_create.png)
<br>

Once created, click on the **Generate new token** button.
![business account](/doc/wa_user_token.png)
<br>

Select **your app**, set the token expiration to **Never**, select the **permissions** as bellow and click on the **Generate token** button.
![business account](/doc/wa_sys_permissions.jpg)<br>

Save your **token** for later and click **OK** when it's done.
![business account](/doc/wa_generate_token.png)<br>
<br><br>

Now go to the **Accounts** section > **WhatsApp Accounts** and click on **Add people**
![business account](/doc/wa_add_account.png)<br>


Select the newly created system account, toggle **Full control** and click on **Assign**
![business account](/doc/wa_select_system.png)<br>
![business account valid](/doc/wa_business_valid.png)<br>

Go back to your **Dashboard** (https://developers.facebook.com/apps/) and link an existing number or create a new one
![add number](/doc/add-number.png)

You can add your phone number by clicking on Manage phone number list
<br>

Now that you are ready to do a test, simply click on the **Send message** button.
![send message](/doc/curl-message.png)<br>

You should get something like this in your **WhatsApp** app
![test message](/doc/test-message.png)<br>

# Webhook
## Using Replit

Fork the following Replit project: https://replit.com/@niko-voiceflow/example-integration-whatsapp?v=1

Open the Secret tool, click on Edit as JSON and copy/paste the following JSON code<br>
![test message](/doc/replit_secret.png)<br><br>

Optional: To support audio messages you will need to use an API key available on PicoVoice Dev console
https://console.picovoice.ai/


```
{
  "PICOVOICE_API_KEY": "",
  "WHATSAPP_VERSION": "v17.0",
  "WHATSAPP_TOKEN": "",
  "VERIFY_TOKEN": "voiceflow",
  "VF_API_KEY": "",
  "VF_PROJECT_ID": "",
  "VF_VERSION_ID": "development",
  "VF_DM_URL": "https://general-runtime.voiceflow.com",
  "VF_TRANSCRIPT_ICON": "https://s3.amazonaws.com/com.voiceflow.studio/share/200x200/200x200.png",
  "PORT": 3000
}
```

Update the keys accordingly with the values you got from the previous steps.<br>

You can find your **Dialog API key (VF_API_KEY)** in the **integration** tab in Creator and the **project ID (VF_PROJECT_ID)** in the **project settings** (this is needed if you want to save transcripts).<br>

For the **VF_VERSION_ID**, you can use 'development', 'production' or a specific version ID (from the **project settings**).<br>

Once done, click on **Run** and you should see something like this:
![run](/doc/replit_run.png)<br>

From the webview tab, you want to copy the URL.

##### WhatsApp Webhook
Back on our **Getting Started** Facebook Developer page, click on the **Configure webhooks** link
![step 3](/doc/step-3.png)<br>

On this new page, click on **Edit**<br>
![edit webhook](/doc/edit-webhook.png)<br><br>

This is where you will need to set your **webhook's callback URL** and your **Verify token**<br>
![edit webhook 2](/doc/edit-webhook-2.png)<br><br>

Do not forget to add **/webhook** at the end of the URL and the **verify token** you set in the **Replit secrets**.<br>
When ready, click on **Verify and Save**.
![webhook](/doc/wa_replit_webhook.png)<br>

On your Replit console, you should see this message:
```WEBHOOK_VERIFIED```<br>

Last step, we want to choose what to receive, and to do so, we need to subscribe to the message event.<br><br>

Click on **Manage** and, on the new window, **subscribe** to **messages**
![manage](/doc/manage.png)<br><br>

You should have a config similar to this one

![sub-messages](/doc/wa_messages.png)<br><br>


## Using ngrok (local)

##### Prepare your dev environement
Clone this repo

```git clone https://github.com/voiceflow/example-integration-whatsapp.git```

In the example-integration-whatsapp, do a:

```npm i```

Install ngrok, more details here: https://ngrok.com/download<br>

Before going further, let's start populating our .env file with our token.
In the root of the app directory, rename the **.env.example** file to **.env**<br>
We are going to populate this file with the needed info for the WhatsApp webhook as well as the Voiceflow project.

Optional: To support audio messages you will need to use an API key available on PicoVoice Dev console
https://console.picovoice.ai/


```
{
  "PICOVOICE_API_KEY": "",
  "WHATSAPP_VERSION": "v17.0",
  "WHATSAPP_TOKEN": "",
  "VERIFY_TOKEN": "voiceflow",
  "VF_API_KEY": "",
  "VF_PROJECT_ID": "",
  "VF_VERSION_ID": "development",
  "VF_DM_URL": "https://general-runtime.voiceflow.com",
  "VF_TRANSCRIPT_ICON": "https://s3.amazonaws.com/com.voiceflow.studio/share/200x200/200x200.png",
  "PORT": 3000
}
```

For now, you can paste the token for the **WHATSAPP_TOKEN** variable,
you can use anything for the **VERIFY_TOKEN** or leave it to 'voiceflow'.

Regarding the port, you can put the value you want, by default the app will use **3000**

You can find your **Dialog API key (VF_API_KEY)** in the **integration** tab in Creator and the **project ID (VF_PROJECT_ID)** in the **project settings** (this is needed if you want to save transcripts).<br>

For the **VF_VERSION_ID**, you can use 'development', 'production' or a specific version ID (from the **project settings**).<br><br>


##### WhatsApp Webhook
Back on our **Getting Started** Facebook Developer page, click on the **Configure Webhook** link<br>
![step 3](/doc/step-3.png)<br><br>

On this new page, click on **Edit**<br>
![edit webhook](/doc/edit-webhook.png)<br><br>

This is where you will need to set your **webhook's callback URL** and your **Verify token**<br>
![edit webhook 2](/doc/edit-webhook-2.png)<br><br>

For the **Verify token**, put what you've set in your **.env** file (**voiceflow** by default)<br>

For the Callback URL to be accessible, we will need to start the app.

From the root of the directory, start the app with

```npm start```

And if everything work as expected, you should have something similar to this<br><br>
![app start](/doc/app-start.png)<br><br>

We are listening, let's use ngrok to open this to the world.

In a new terminal, type

```ngrok http 3000```

Replace **3000** with the **PORT** number you choose to use.
<br><br>
![ngrok console](/doc/ngrok-console.png)<br>
Here, the URL you want to copy is the secure one (starting with https)
Almost there, go back to your **Config page**, paste this URL and add the **/webhook** path to it.<br>
![webhook url](/doc/webhook-url.png)<br><br>

And click on **Verify and save**
If everything is fine, the previous window should close and your webhook ready.
<br>
![webhook setup](/doc/webhook-setup.png)<br><br>

On your terminal, you should see this message:
```WEBHOOK_VERIFIED```<br><br>

Last step, we want to choose what to receive, and to do so, we need to subscribe to the message event.<br><br>

Click on **Manage** and, on the new window, **subscribe** to **messages**
![manage](/doc/manage.png)<br><br>

You should have a config similar to this one

![sub-messages](/doc/wa_messages.png)<br><br>


# Testing

**Congratulations**, you are ready to test your Voiceflow project using WhatsApp!<br>
Use the **WhatsApp** app on your phone to send a message to the number you got from the **Quickstart > API Setup** page.<br>
![wa-number](/doc/wa_number.png)<br><br>
![demo](/doc/wa_demo.png)<br><br>
![publish-button](/doc/whatsapp-chat.png)<br><br>

# Documentation
Cloud API: https://developers.facebook.com/docs/whatsapp/cloud-api<br>
Voiceflow Dialog Manager API: https://developer.voiceflow.com/reference<br>
Project Versioning in Voiceflow: https://www.voiceflow.com/docs/documentation-project-versioning<br>
