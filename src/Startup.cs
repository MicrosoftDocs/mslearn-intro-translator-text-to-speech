using CognitiveServicesDemo.TextToSpeech.Models;
using CognitiveServicesDemo.TextToSpeech.Repositories;
using CognitiveServicesDemo.TextToSpeech.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.IO;

namespace CognitiveServicesDemo.TextToSpeech
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var speechServiceOptions = new SpeechServiceOptions();
            Configuration.GetSection(SpeechServiceOptions.SpeechService).Bind(speechServiceOptions);

            var blobStorageOptions = new BlobStorageOptions();
            Configuration.GetSection(BlobStorageOptions.BlobStorage).Bind(blobStorageOptions);

            var translatorOptions = new TranslatorOptions();
            Configuration.GetSection(TranslatorOptions.Translator).Bind(translatorOptions);

            services
                .AddSingleton<SpeechServiceOptions>(x => speechServiceOptions)
                .AddSingleton<BlobStorageOptions>(x => blobStorageOptions)
                .AddSingleton<TranslatorOptions>(x => translatorOptions)
                .AddSingleton<VoiceInformationService>()
                .AddScoped<TextToSpeechService>()
                .AddScoped<TranslatorService>()
                .AddScoped<BlobStorageRepository>()
                .AddHttpClient();

            services.AddControllersWithViews();

            // In production, the React files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/build";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseReactDevelopmentServer(npmScript: "start");
                }
            });
        }

    }
}
