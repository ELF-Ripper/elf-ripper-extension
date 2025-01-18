MEMORY
{
  FLASH (rx)  : ORIGIN = 0x08000000, LENGTH = 256K
  RAM (rwx)   : ORIGIN = 0x20000000, LENGTH = 128K
}

SECTIONS
{
  /* The startup code goes in the .isr_vector section, which is allocated to Flash memory */
  .isr_vector :
  {
    KEEP(*(.isr_vector))
  } > FLASH

  /* The program code and other read-only data go into Flash memory */
  .text :
  {
    *(.text)           /* .text sections (code) */
    *(.text*)          /* .text* sections (code) */
    *(.rodata)         /* .rodata sections (constants, strings, etc.) */
    *(.rodata*)        /* .rodata* sections (constants, strings, etc.) */
    *(.glue_7)         /* glue arm to thumb code */
    *(.glue_7t)        /* glue thumb to arm code */
    *(.eh_frame)
  } > FLASH

  /* The data section which is read/write goes into RAM */
  .data : AT(__data_load)
  {
    __data_start = .;
    *(.data)           /* .data sections */
    *(.data*)          /* .data* sections */
    __data_end = .;
  } > RAM
  __data_load = LOADADDR(.data);

  /* The bss section which is zero-initialized goes into RAM */
  .bss :
  {
    __bss_start = .;
    *(.bss)
    *(.bss*)
    *(COMMON)
    __bss_end = .;
  } > RAM

  /* The .init_array section goes into RAM */
  .init_array :
  {
    PROVIDE_HIDDEN (__init_array_start = .);
    KEEP (*(SORT_BY_INIT_PRIORITY(.init_array.*) SORT_BY_INIT_PRIORITY(.ctors.*)))
    KEEP (*(.init_array EXCLUDE_FILE (*crtbegin.o *crtbegin?.o *crtend.o *crtend?.o ) .ctors))
    PROVIDE_HIDDEN (__init_array_end = .);
  } > RAM

  /* The .fini_array section goes into RAM */
  .fini_array :
  {
    PROVIDE_HIDDEN (__fini_array_start = .);
    KEEP (*(SORT_BY_INIT_PRIORITY(.fini_array.*) SORT_BY_INIT_PRIORITY(.dtors.*)))
    KEEP (*(.fini_array EXCLUDE_FILE (*crtbegin.o *crtbegin?.o *crtend.o *crtend?.o ) .dtors))
    PROVIDE_HIDDEN (__fini_array_end = .);
  } > RAM

  /* The .stack section goes into RAM */
  .stack (NOLOAD):
  {
    . = ALIGN(8);
    __stack_start__ = .;
    . = . + 0x400;  /* 1KB stack size */
    . = ALIGN(8);
    __stack_end__ = .;
  } > RAM

  /* The heap section goes into RAM */
  .heap (NOLOAD):
  {
    __heap_start = .;
    . = . + 0x2000; /* 8KB heap size */
    __heap_end = .;
  } > RAM

  /* The .comment section which is optional and usually contains version control info */
  .comment 0 : { *(.comment) }

  /* Add the program header table */
  . = ALIGN(4K);
  .data_align_4K :
  {
    KEEP(*(.data_align_4K))
  } > RAM

  /* Add the note segment */
  . = ALIGN(4K);
  .note :
  {
    *(.note)
  } > RAM
}
