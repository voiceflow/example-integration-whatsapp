# Example code for Voiceflow <> WhatsApp integration
How to use WhatsApp Cloud API with Voiceflow Dialog Manager API
* * *
<br><br>
# Prepare your dev environement
Clone this repo

```git clone https://github.com/voiceflow/example-integration-whatsapp.git```

In the example-integration-whatsapp, do a:

```npm i```

Install ngrok, more details here: https://ngrok.com/download

<br><br>
# Create an app on Facebook Developers portal

Follow the Get started guide here to create your app and get your WhatsApp token.<br>
https://developers.facebook.com/docs/whatsapp/cloud-api/get-started
<br><br>

![Get Started](/doc/get-started.png)



## The app

Once registered as a dev, go to https://developers.facebook.com/apps/
<br><br>

Create a new app by clicking on ![create a new app](/doc/new-app.png)
<br><br>

Select "**Other**" for the use case ![business app](/doc/wa_create_app.png) and click **Next**
<br><br>


Select "**Business**" for app type ![business app](/doc/business-app.png) and click **Next**
<br><br>

Fill the needed info for the app creation ![app info](/doc/app-info.png) and click **Create app**
<br><br>

On the next page, scroll down to the WhatsApp integration<br><br>
![whatsapp integration](/doc/whatsapp-setup.png)<br>
and click on **Set up**
<br><br>

Create a Business account (or select an existing one)<br><br>
![business account](/doc/business-account.png)<br>
<br><br>

Go to https://business.facebook.com/home/accounts to add a system user.

Select your Business account and click on the gear (Settings)<br><br>
![business account](/doc/wa_b_settings.png)<br>
<br><br>


In Users section, select System users and then click on **Add**<br><br>
![business account](/doc/wa_b_add.png)<br>
<br><br>


Create a new system user with the **Admin** role<br><br>
![business account](/doc/wa_user_create.png)<br>
<br><br>

Once created, click on the **Generate new token** button.<br><br>
![business account](/doc/wa_user_token.png)<br>
<br><br>

Select **your app**, set the token expiration to **Never**, select the **permissions** as bellow and click on the **Generate token** button.<br><br>
![business account](/doc/wa_sys_permissions.jpg)<br>
<br><br>

Save your **token** for later and click **OK** when it's done.<br><br>
![business account](/doc/wa_generate_token.png)<br>
<br><br>

Now go to the **Accounts** section > **WhatsApp Accounts** and click on **Add people**<br><br>
![business account](/doc/wa_add_account.png)<br>
<br><br>

Select the newly created system account, toggle **Full control** and click on **Assign**<br><br>
![business account](/doc/wa_select_system.png)<br>
<br><br>



Go back to your **Dashboard** (https://developers.facebook.com/apps/) and link an existing number or create a new one<br><br>
![add number](/doc/add-number.png)

You can add your phone number by clicking on Manage phone number list
<br><br>

Now that you are ready to do a test, simply click on the **Send message** button.<br>
![send message](/doc/curl-message.png)<br><br>

You should get something like this in your **WhatsApp** app<br>
![test message](/doc/test-message.png)<br><br>

# Webhook
## Using Replit


## Using ngrok (local)
Before going further, let's start populating our .env file with our token.
In the root of the app directory, rename the **.env.example** file to **.env**<br>
We are going to populate this file with the needed info for the WhatsApp webhook as well as the Voiceflow project.

```
WHATSAPP_VERSION = 'v17.0'
WHATSAPP_TOKEN = 'YOUR_WHATSAPP_SYSTEM_USER_TOKEN'
VERIFY_TOKEN = 'voiceflow'
VF_API_KEY = 'YOUR_VOICEFLOW_API_KEY'
VF_PROJECT_ID = 'YOUR_VOICEFLOW_PROJECT_ID'
VF_VERSION_ID = 'development' # or 'production'
VF_DM_URL = 'https://general-runtime.voiceflow.com'
VF_TRANSCRIPT_ICON = 'https://s3.amazonaws.com/com.voiceflow.studio/share/200x200/200x200.png'
PORT = '3000'
```

For now, you can paste the token for the **WHATSAPP_TOKEN** variable,
you can use anything for the **VERIFY_TOKEN** or leave it to 'voiceflow'.

Regarding the port, you can put the value you want, by default the app will use **3000**

For the **VF_** variables, we will see that a bit later.


Back on our **Getting Started** Facebook Developer page, click on the **Configure webhooks** link in **Step 3**<br>
![step 3](/doc/step-3.png)<br><br>

On this new page, click on **Edit**<br>
![edit webhook](/doc/edit-webhook.png)<br><br>

This is where you will need to set your **webhook's callback URL** and your **Verify token**<br>
![edit webhook 2](/doc/edit-webhook-2.png)<br><br>

For the **Verify token**, put what you've set in your **.env** file (**voiceflow** by default)<br>
For the Callback URL, we will need to start the app.

From the root of the directory, start the app with

```npm start```

And if everything work as expected, you should have something similar to this<br><br>
![app start](/doc/app-start.png)<br><br>

We are listening, let's use ngrok to open this to the world.

In a new terminal, type

```ngrok http 3000```

Replace **3000** with the **PORT** number you choose to use.
<br><br>
![ngrok console](/doc/ngrok-console.png)<br><br>
Here, the URL you want to copy is the secure one (starting with https)
<br><br>

Almost there, go back to your **Config page**, paste this URL and add the **/webhook** path to it.<br><br>
![webhook url](/doc/webhook-url.png)<br><br>

And click on **Verify and save**
<br><br>
If everything is fine, the previous window should close and your webhook ready.
<br><br>
![webhook setup](/doc/webhook-setup.png)<br><br>

On your terminal, you should see this message:
```WEBHOOK_VERIFIED```<br><br>

Last step, we want to choose what to receive, and to do so, we need to subscribe to the message event.<br><br>

Click on **Manage** and, on the new window, **subscribe** to **messages**
![manage](/doc/manage.png)<br><br>

You should have a config similar to this one

![sub-messages](/doc/wa_messages.png)<br><br>


# Voiceflow Project

So, the webhook is setup, our app is running waiting to get some messages and send them to our Dialog Manager API running your Voiceflow Chat project.

To use the Dialog Manager API with your project, we will need the project API key and, to test it in an easy way, we will create and use the 'production' version.

In Voiceflow Creator, open a Chat project and go to the Integrations<br><br>
![integrations](/doc/integrations.png)<br><br>

On the Integrations page, you want to copy the API key<br><br>
![api-key](/doc/api-key.png)<br><br>

Now, paste it in your .env file for the **VF_API_KEY** variable<br>

Back on Voiceflow Creator, go to the **Designer** view and click on the **Publish** button<br><br>
![publish-button](/doc/publish-button.png)<br><br>

Set a name (optional) for this version and click on **Publish** to publish this version as the **production** one.<br><br>
![publish-button](/doc/prod.png)<br><br>

# Testing

**Congratulations**, you are ready to test your VOiceflow project using WhatsApp!<br><br>

Close your app with **Ctrl+C** (but keep ngrok running in the other terminal) and launch it again so it will use the updated values from the .env file.<br><br>

```
Ctrl+C

npm start
```

That's it, start interacting on WhatsApp with your Voiceflow project.<br><br>

![publish-button](/doc/whatsapp-chat.png)<br><br>



# Documentation
Cloud API: https://developers.facebook.com/docs/whatsapp/cloud-api<br>
Voiceflow Dialog Manager API: https://developer.voiceflow.com/reference<br>
Project Versioning in Voiceflow: https://www.voiceflow.com/docs/documentation-project-versioning<br>
