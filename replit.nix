{ pkgs }: {
    deps = [
        pkgs.nodejs-16_x
        pkgs.cmake
        pkgs.nodePackages.typescript
    ];
}