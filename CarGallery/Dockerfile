# ---- Build Stage ----
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY CarGallery/CarGallery.csproj CarGallery/
RUN dotnet restore CarGallery/CarGallery.csproj

# Copy the rest of the source code
COPY CarGallery/ CarGallery/

# Publish the application
WORKDIR /src/CarGallery
RUN dotnet publish CarGallery.csproj -c Release -o /app/publish --no-restore

# ---- Runtime Stage ----
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy published output
COPY --from=build /app/publish .

# Create images directory for file uploads
RUN mkdir -p wwwroot/images

# Render injects PORT env variable; ASP.NET Core reads ASPNETCORE_URLS
ENV ASPNETCORE_URLS=http://+:${PORT:-8080}

EXPOSE 8080

ENTRYPOINT ["dotnet", "CarGallery.dll"]
